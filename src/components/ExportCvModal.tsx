import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, FileText, Check, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import defaultProfilePhoto from "../sofa_profile.png";
import qrCodeImage from "../sofa_fauzi_portfolio.png";

// Helper to recursively strip modern layout colors like oklch, oklab, and color-mix values because html2canvas's inner CSS parser crashes on them
function stripModernColors(cssText: string): string {
  if (!cssText) return "";
  
  // 1. First run of regex replacements for flat basic instances to speed compile-rate
  let result = cssText
    .replace(/oklch\([^)(]*\)/gi, "rgb(16, 185, 129)")
    .replace(/oklab\([^)(]*\)/gi, "rgb(16, 185, 129)");
  
  // 2. Scan and recursively cut out balanced parentheses functions like oklch(...), oklab(...), and color-mix(...)
  const targets = ["color-mix", "oklch", "oklab"];
  let modified = true;
  let attemptLimit = 1500; // safe threshold to prevent blocking developer threads
  
  while (modified && attemptLimit > 0) {
    attemptLimit--;
    modified = false;
    
    let earliestPrefixIdx = -1;
    let foundPrefix = "";
    
    for (const prefix of targets) {
      const idx = result.indexOf(prefix + "(");
      if (idx !== -1 && (earliestPrefixIdx === -1 || idx < earliestPrefixIdx)) {
        earliestPrefixIdx = idx;
        foundPrefix = prefix;
      }
    }
    
    if (earliestPrefixIdx !== -1) {
      const startParenIdx = earliestPrefixIdx + foundPrefix.length;
      let depth = 0;
      let endParenIdx = -1;
      
      for (let i = startParenIdx; i < result.length; i++) {
        if (result[i] === "(") {
          depth++;
        } else if (result[i] === ")") {
          depth--;
          if (depth === 0) {
            endParenIdx = i;
            break;
          }
        }
      }
      
      if (endParenIdx !== -1) {
        const before = result.substring(0, earliestPrefixIdx);
        const after = result.substring(endParenIdx + 1);
        
        let substitute = "rgb(16, 185, 129)"; // emerald-500 fallback
        if (foundPrefix === "color-mix") {
          substitute = "rgba(16, 185, 129, 0.4)";
        }
        
        result = before + substitute + after;
        modified = true;
      } else {
        result = result.substring(0, earliestPrefixIdx) + "rgb(16, 185, 129)" + result.substring(earliestPrefixIdx + foundPrefix.length);
        modified = true;
      }
    }
  }
  
  // 3. Transform fallback keywords if oklab/oklch is referenced as plain keywords or in some leftover var definitions
  result = result.replace(/oklab/gi, "srgb");
  result = result.replace(/oklch/gi, "srgb");
  
  return result;
}

interface ExportCvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportCvModal({ isOpen, onClose }: ExportCvModalProps) {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!cvRef.current) return;
    setIsExporting(true);
    setExportSuccess(false);

    // Save and sanitize style elements/stylesheets to prevent html2canvas OKLCH/OKLAB parser crash
    const styleElements = Array.from(document.querySelectorAll("style"));
    const originalStyleContents = new Map<HTMLStyleElement, string>();
    
    // Save original styles and strip modern color functions out
    styleElements.forEach(style => {
      const originalText = style.textContent || "";
      originalStyleContents.set(style, originalText);
      if (originalText && (originalText.includes("oklch") || originalText.includes("oklab") || originalText.includes("color-mix"))) {
        style.textContent = stripModernColors(originalText);
      }
    });

    // Temporarily copy, clean and inject compiled CSS links to prevent CORS/unsupported function issues and layout loss
    const linkElements = Array.from(document.querySelectorAll("link[rel='stylesheet']")) as HTMLLinkElement[];
    const tempStyles: HTMLStyleElement[] = [];

    for (const link of linkElements) {
      try {
        const isSameOrigin = link.href.startsWith(window.location.origin) || link.href.startsWith("/") || !link.href.startsWith("http");
        if (isSameOrigin) {
          const response = await fetch(link.href);
          const cssText = await response.text();
          
          // Replace modern oklch/oklab/color-mix colors safely in the layout stylesheet text
          const sanitizedCss = stripModernColors(cssText);
            
          const tempStyle = document.createElement("style");
          tempStyle.setAttribute("data-temp-clean", "true");
          tempStyle.textContent = sanitizedCss;
          document.head.appendChild(tempStyle);
          tempStyles.push(tempStyle);
          
          link.disabled = true;
        }
      } catch (err) {
        console.warn("Could not copy and sanitize stylesheet link:", link.href, err);
      }
    }

    try {
      // Create PDF using high-resolution Canvas rendering
      const element = cvRef.current;
      
      // Temporarily enforce high contrast colors and perfect pixel alignment for render
      const canvas = await html2canvas(element, {
        scale: 2.2, // Crisp retina-quality resolution
        useCORS: false,
        logging: true, // Enable logging to aid diagnostic in chrome console if anything goes astray
        backgroundColor: null, // Transparent fallback to capture CSS background gradients cleanly
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Strict layout fit: A4 page size calculations
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Extract all text nodes and superimpose an invisible selectable vector text layer on top of the image
      const textNodes: { 
        text: string; 
        x: number; 
        y: number; 
        width: number; 
        height: number; 
        fontSize: number;
        fontStyle: string;
      }[] = [];
      
      const pdfLinks: {
        url: string;
        x: number;
        y: number;
        width: number;
        height: number;
      }[] = [];

      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      let node;
      
      const containerRect = element.getBoundingClientRect();
      const scaleX = pdfWidth / containerRect.width;
      const scaleY = pdfHeight / containerRect.height;

      while ((node = walker.nextNode())) {
        const parent = node.parentElement;
        // Skip hidden wrapper/containers or elements that shouldn't be copyable
        if (parent && parent.closest(".no-print")) continue;
        
        const rawText = node.nodeValue;
        if (rawText && rawText.trim().length > 0) {
          let fontSize = 10;
          let fontStyle = "Helvetica";
          if (parent) {
            const style = window.getComputedStyle(parent);
            fontSize = parseFloat(style.fontSize) || 12;
            const fontNameLower = style.fontFamily.toLowerCase();
            if (fontNameLower.includes("mono") || fontNameLower.includes("code") || fontNameLower.includes("jetbrains")) {
              fontStyle = "Courier";
            }
          }

          try {
            // Find individual words and get their precise layout positions on the screen
            const regex = /\S+/g;
            let match;
            while ((match = regex.exec(rawText)) !== null) {
              const word = match[0];
              const startOffset = match.index;
              const endOffset = startOffset + word.length;
              
              const range = document.createRange();
              range.setStart(node, startOffset);
              range.setEnd(node, endOffset);
              const rect = range.getBoundingClientRect();
              
              // Only push words that are physically visible on the screen
              if (rect.width > 0 && rect.height > 0) {
                const x = rect.left - containerRect.left;
                const y = rect.top - containerRect.top;
                
                textNodes.push({
                  text: word,
                  x,
                  y,
                  width: rect.width,
                  height: rect.height,
                  fontSize,
                  fontStyle,
                });

                // Measure coordinates for text-based link annotations in the PDF
                if (word.includes("linktr.ee/sofamotion") || word.includes("sofamotion")) {
                  pdfLinks.push({
                    url: "https://linktr.ee/sofamotion",
                    x: x * scaleX,
                    y: y * scaleY,
                    width: rect.width * scaleX,
                    height: rect.height * scaleY
                  });
                } else if (word.includes("sofafauzi@gmail.com")) {
                  pdfLinks.push({
                    url: "mailto:sofafauzi@gmail.com",
                    x: x * scaleX,
                    y: y * scaleY,
                    width: rect.width * scaleX,
                    height: rect.height * scaleY
                  });
                }
              }
            }
          } catch (e) {
            console.warn("Failed to walk text node word measurements:", e);
          }
        }
      }

      // Add link annotation directly for the Portfolio QR code block in the physical PDF design!
      const qrElement = element.querySelector("[alt='Portfolio QR Code']");
      if (qrElement) {
        const qrRect = qrElement.getBoundingClientRect();
        if (qrRect.width > 0 && qrRect.height > 0) {
          const qrX = qrRect.left - containerRect.left;
          const qrY = qrRect.top - containerRect.top;
          pdfLinks.push({
            url: "https://linktr.ee/sofamotion",
            x: qrX * scaleX,
            y: qrY * scaleY,
            width: qrRect.width * scaleX,
            height: qrRect.height * scaleY
          });
        }
      }

      // Draw the invisible selectable text layer on top of the image
      textNodes.forEach((nodeItem) => {
        const x_mm = nodeItem.x * scaleX;
        // Offset the baseline so text lines up perfectly with its printed visual counterpart
        // For standard fonts, baseline is typically ~130% down from the bounding rect top in browser measurements to match the visual text perfectly
        const y_mm = (nodeItem.y + nodeItem.height * 1.3) * scaleY;
        
        pdf.setFont(nodeItem.fontStyle, "normal");
        
        // Convert pixel font-size to PDF points (1 pt = 1/72 inch, 1 mm = 72/25.4 pt = 2.83464 pt)
        const sizeInPt = nodeItem.fontSize * scaleY * 2.83464;
        pdf.setFontSize(sizeInPt);
        
        // Write text invisibly so user can select, highlight, search, and copy-paste it!
        // @ts-ignore - renderingMode is a standard jsPDF option to inject Tr 3 (invisible) text
        pdf.text(nodeItem.text, x_mm, y_mm, { renderingMode: "invisible" });
      });

      // Overlay clickable hyperlinks precisely corresponding to their screen elements
      pdfLinks.forEach((linkItem) => {
        pdf.link(linkItem.x, linkItem.y, linkItem.width, linkItem.height, {
          url: linkItem.url,
        });
      });

      pdf.save("Nur_Sofa_Fauzi_Creative_CV.pdf");
      
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Maaf, gagal mengekspor PDF. Detail error: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      // Restore all original style tags and link elements immediately
      styleElements.forEach(style => {
        const originalText = originalStyleContents.get(style);
        if (originalText !== undefined) {
          style.textContent = originalText;
        }
      });
      
      linkElements.forEach(link => {
        link.disabled = false;
      });
      
      tempStyles.forEach(style => {
        style.remove();
      });
      
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-hidden">
        {/* Backdrop overlay trigger click */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 z-10"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-5xl h-[95vh] md:h-[90vh] bg-[#0E1012] border border-zinc-900 rounded-2xl flex flex-col z-20 overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
        >
          {/* TOP CONTROLS BAR */}
          <div className="p-4 md:px-6 bg-[#0B0D0F] border-b border-zinc-950 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 z-30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                <FileText size={18} />
              </div>
              <div>
                <h3 className="font-display font-medium text-sm text-white tracking-wider uppercase">EXPORT DYNAMIC CREATIVE CV</h3>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">HIGH-HQ VECTOR SCREEN RENDERER</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {/* Theme Selector */}
              <div className="p-1 bg-black/50 border border-zinc-900 rounded-lg flex gap-1">
                <button
                  onClick={() => setIsDarkTheme(true)}
                  className={`px-3 py-1.5 rounded text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
                    isDarkTheme
                      ? "bg-zinc-900 text-emerald-400 font-bold"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  SLATE DARK
                </button>
                <button
                  onClick={() => setIsDarkTheme(false)}
                  className={`px-3 py-1.5 rounded text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
                    !isDarkTheme
                      ? "bg-white text-black font-bold"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  PRINT LIGHT
                </button>
              </div>

              {/* PDF Download Button */}
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-zinc-950 text-xs font-display font-black tracking-widest uppercase py-2 px-4 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.30)] hover:shadow-[0_0_30px_rgba(16,185,129,0.50)] transition-all cursor-pointer"
              >
                {isExporting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> RENDERING...
                  </>
                ) : exportSuccess ? (
                  <>
                    <Check size={14} /> EXPORTED!
                  </>
                ) : (
                  <>
                    <Download size={14} /> DOWNLOAD PDF
                  </>
                )}
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 border border-zinc-900 hover:border-zinc-800 bg-black/30 hover:bg-black/60 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* SIZING WORKBENCH CONTAINER */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-zinc-950/40 flex justify-center items-start">
            {/* Aspect Ratio A4 Wrapper with scale responsiveness */}
            <div className="w-full flex justify-center py-4">
              <div 
                ref={cvRef}
                id="creative-cv-print"
                className={`w-[794px] h-[1123px] p-12 flex flex-col justify-between shrink-0 font-sans shadow-2xl transition-all duration-300 border ${
                  isDarkTheme 
                    ? "text-zinc-300 border-zinc-900" 
                    : "bg-white text-zinc-700 border-zinc-200"
                }`}
                style={{
                  boxSizing: "border-box",
                  background: isDarkTheme 
                    ? "radial-gradient(circle at 15% 15%, rgba(16, 185, 129, 0.28) 0%, transparent 50%), radial-gradient(circle at 85% 30%, rgba(16, 185, 129, 0.22) 0%, transparent 50%), radial-gradient(circle at 50% 70%, rgba(20, 184, 166, 0.18) 0%, transparent 60%), #080911"
                    : "#FFFFFF",
                  color: isDarkTheme ? "#d4d4d8" : "#3f3f46"
                }}
              >
                {/* CV HEADER BLOCK */}
                <div 
                  className="pb-6 border-b flex justify-between items-end"
                  style={{ borderColor: isDarkTheme ? "#1f2937" : "#e5e7eb" }}
                >
                  <div>
                    <h1 
                      className="text-4xl font-extrabold tracking-tighter"
                      style={{ color: isDarkTheme ? "#ffffff" : "#111827" }}
                    >
                      NUR SOFA FAUZI
                    </h1>
                    <p 
                      className="font-mono text-[11px] tracking-widest uppercase mt-1.5 font-semibold"
                      style={{ color: isDarkTheme ? "#10b981" : "#059669" }}
                    >
                      Motion Graphic Designer & Animator
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p 
                      className="font-mono text-[9px] tracking-widest uppercase"
                      style={{ color: "#71717a" }}
                    >
                      LOCATION
                    </p>
                    <p 
                      className="text-xs"
                      style={{ color: isDarkTheme ? "#d4d4d8" : "#1f2937" }}
                    >
                      Jakarta Timur, Indonesia
                    </p>
                  </div>
                </div>

                {/* TWO COLUMN GRID CONTENT */}
                <div className="flex-grow grid grid-cols-12 gap-8 pt-8 pb-4">
                  
                  {/* LEFT SIDEBAR COLUMN (Width: 5/12) */}
                  <div 
                    className="col-span-5 pr-6 border-r flex flex-col justify-between"
                    style={{ borderColor: isDarkTheme ? "#1f2937" : "#e5e7eb" }}
                  >
                    
                    {/* PROFILE PICTURE */}
                    <div className="mb-2 flex justify-center bg-transparent">
                      <div className="w-[150px] aspect-[4/5] flex items-center justify-center bg-transparent overflow-visible relative">
                        <img 
                          src={defaultProfilePhoto} 
                          alt="Nur Sofa Fauzi Profile Photo" 
                          className="max-w-full max-h-full object-contain select-none z-10 grayscale scale-[1.60] origin-[center_17%]"
                          style={{ 
                            filter: "grayscale(100%)", 
                            WebkitFilter: "grayscale(100%)",
                          }}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    {/* PROFILE CONTACTS */}
                    <div className="space-y-4">
                      <h3 
                        className="font-mono text-[10px] uppercase tracking-widest font-bold"
                        style={{ color: isDarkTheme ? "#71717a" : "#9ca3af" }}
                      >
                        CONTACT
                      </h3>
                      <div className="space-y-3 text-xs">
                        <div>
                          <div 
                            className="font-mono text-[9px] uppercase tracking-wide"
                            style={{ color: "#71717a" }}
                          >
                            PHONE
                          </div>
                          <div 
                            className="font-semibold"
                            style={{ color: isDarkTheme ? "#e4e4e7" : "#1f2937" }}
                          >
                            081213791137
                          </div>
                        </div>
                        <div>
                          <div 
                            className="font-mono text-[9px] uppercase tracking-wide"
                            style={{ color: "#71717a" }}
                          >
                            EMAIL
                          </div>
                          <div 
                            className="font-semibold"
                            style={{ color: isDarkTheme ? "#e4e4e7" : "#1f2937" }}
                          >
                            sofafauzi@gmail.com
                          </div>
                        </div>
                        <div>
                          <div 
                            className="font-mono text-[9px] uppercase tracking-wide"
                            style={{ color: "#71717a" }}
                          >
                            PORTFOLIO URL
                          </div>
                          <div 
                            className="font-semibold text-xs"
                            style={{ color: isDarkTheme ? "#10b981" : "#059669" }}
                          >
                            https://linktr.ee/sofamotion
                          </div>
                        </div>
                        <div 
                          className="mt-2.5 p-2.5 rounded-lg border flex items-center gap-3"
                          style={{ 
                            backgroundColor: isDarkTheme ? "rgba(24, 24, 27, 0.4)" : "rgba(244, 244, 245, 0.5)",
                            borderColor: isDarkTheme ? "rgba(63, 63, 70, 0.3)" : "rgba(228, 228, 231, 0.8)"
                          }}
                        >
                          <div className="shrink-0 p-1.5 bg-white rounded-md border border-zinc-200/40 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                            <img 
                              src={qrCodeImage} 
                              alt="Portfolio QR Code" 
                              className="w-[56px] h-[56px] object-contain select-none block"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <div 
                              className="font-mono text-[8px] uppercase tracking-wider font-bold"
                              style={{ color: isDarkTheme ? "#10b981" : "#059669" }}
                            >
                              PORTFOLIO QR
                            </div>
                            <p 
                              className="text-[9px] leading-snug"
                              style={{ color: isDarkTheme ? "#a1a1aa" : "#52525b" }}
                            >
                              Scan code to view my creative work website and reels.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* EDUCATION SECTION */}
                    <div 
                      className="space-y-4 pt-4 border-t border-dashed"
                      style={{ borderColor: isDarkTheme ? "#1f2937" : "#e5e7eb" }}
                    >
                      <h3 
                        className="font-mono text-[10px] uppercase tracking-widest font-bold"
                        style={{ color: isDarkTheme ? "#71717a" : "#9ca3af" }}
                      >
                        EDUCATION
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <span 
                            className="font-mono text-[9px] block"
                            style={{ color: isDarkTheme ? "#71717a" : "#9ca3af" }}
                          >
                            2016 — 2021
                          </span>
                          <h4 
                            className="text-xs font-bold uppercase mt-0.5"
                            style={{ color: isDarkTheme ? "#e4e4e7" : "#111827" }}
                          >
                            Universitas Negeri Jakarta
                          </h4>
                          <p 
                            className="text-[10px] mt-0.5"
                            style={{ color: isDarkTheme ? "#a1a1aa" : "#4b5563" }}
                          >
                            Bachelor of Visual Art Education
                          </p>
                        </div>
                        <div>
                          <span 
                            className="font-mono text-[9px] block"
                            style={{ color: isDarkTheme ? "#71717a" : "#9ca3af" }}
                          >
                            2012 — 2015
                          </span>
                          <h4 
                            className="text-xs font-bold uppercase mt-0.5"
                            style={{ color: isDarkTheme ? "#e4e4e7" : "#111827" }}
                          >
                            SMK Angkasa 1 Halim PK
                          </h4>
                          <p 
                            className="text-[10px] mt-0.5"
                            style={{ color: isDarkTheme ? "#a1a1aa" : "#4b5563" }}
                          >
                            Vocational High School Degree
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* METERS */}
                    <div 
                      className="space-y-4 pt-4 border-t border-dashed"
                      style={{ borderColor: isDarkTheme ? "#1f2937" : "#e5e7eb" }}
                    >
                      <h3 
                        className="font-mono text-[10px] uppercase tracking-widest font-bold"
                        style={{ color: isDarkTheme ? "#71717a" : "#9ca3af" }}
                      >
                        SOFTWARE SUITE
                      </h3>
                      <div className="space-y-3">
                        {[
                          { name: "After Effects", value: 95 },
                          { name: "Photoshop", value: 90 },
                          { name: "CapCut Pro", value: 85 },
                          { name: "Adobe Premiere Pro", value: 85 },
                          { name: "Adobe Illustrator", value: 80 }
                        ].map((sw, sIdx) => (
                          <div key={sIdx} className="space-y-1">
                            <div className="flex justify-between items-center text-[10px] font-mono">
                              <span style={{ color: isDarkTheme ? "#e4e4e7" : "#374151" }}>{sw.name}</span>
                              <span style={{ color: isDarkTheme ? "#10b981" : "#059669" }}>{sw.value}%</span>
                            </div>
                            <div 
                              className="w-full h-1.5 rounded-full overflow-hidden"
                              style={{ backgroundColor: isDarkTheme ? "#1f2937" : "#f3f4f6" }}
                            >
                              <div 
                                className="h-full rounded-full"
                                style={{ 
                                  backgroundColor: isDarkTheme ? "#10b981" : "#059669", 
                                  width: `${sw.value}%` 
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                  <div className="col-span-7 flex flex-col justify-between pl-2">
                    
                    {/* WORK HISTORY */}
                    <div className="space-y-6">
                      <h3 
                        className="font-mono text-[11px] uppercase tracking-widest font-bold pb-2 border-b"
                        style={{ 
                          borderColor: isDarkTheme ? "#1f2937" : "#e5e7eb",
                          color: isDarkTheme ? "#71717a" : "#9ca3af"
                        }}
                      >
                        PROFESSIONAL EXPERIENCE
                      </h3>
                      
                      {/* Job 1 */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                          <h4 
                            className="text-sm font-bold uppercase"
                            style={{ color: isDarkTheme ? "#ffffff" : "#111827" }}
                          >
                            Motion Graphic Designer
                          </h4>
                          <span 
                            className="font-mono text-[9px]"
                            style={{ color: isDarkTheme ? "#71717a" : "#9ca3af" }}
                          >
                            OCT 2022 — PRESENT
                          </span>
                        </div>
                        <p 
                          className="text-xs font-mono font-semibold tracking-wide uppercase"
                          style={{ color: isDarkTheme ? "#10b981" : "#059669" }}
                        >
                          RCTI+ (Rajawali Citra Televisi Indonesia)
                        </p>
                        
                        <ul className="space-y-1.5 pt-1">
                          <li 
                            className="flex gap-2 items-start text-[11px] leading-relaxed"
                            style={{ color: isDarkTheme ? "#d4d4d8" : "#374151" }}
                          >
                            <span 
                              className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" 
                              style={{ backgroundColor: "#10b981" }}
                            />
                            <span>Conceptualize and execute high-fidelity motion graphics and digital video assets to drive user acquisition and engagement for the RCTI+ OTT platform.</span>
                          </li>
                          <li 
                            className="flex gap-2 items-start text-[11px] leading-relaxed"
                            style={{ color: isDarkTheme ? "#d4d4d8" : "#374151" }}
                          >
                            <span 
                              className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" 
                              style={{ backgroundColor: "#10b981" }}
                            />
                            <span>Collaborate closely with creative directors and marketing teams to translate promotional briefs into dynamic on-air bumpers, social media campaigns, and digital platform visuals.</span>
                          </li>
                          <li 
                            className="flex gap-2 items-start text-[11px] leading-relaxed"
                            style={{ color: isDarkTheme ? "#d4d4d8" : "#374151" }}
                          >
                            <span 
                              className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" 
                              style={{ backgroundColor: "#10b981" }}
                            />
                            <span>Maintain strict broadcast quality standards while managing multiple high-priority promotional projects simultaneously under tight broadcasting schedules.</span>
                          </li>
                        </ul>
                      </div>

                      {/* Job 2 */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                          <h4 
                            className="text-sm font-bold uppercase"
                            style={{ color: isDarkTheme ? "#ffffff" : "#111827" }}
                          >
                            Animator Motion Graphic
                          </h4>
                          <span 
                            className="font-mono text-[9px]"
                            style={{ color: isDarkTheme ? "#71717a" : "#9ca3af" }}
                          >
                            MAY 2021 — SEPT 2022
                          </span>
                        </div>
                        <p 
                          className="text-xs font-mono font-semibold tracking-wide uppercase"
                          style={{ color: isDarkTheme ? "#10b981" : "#059669" }}
                        >
                          PT. Ruang Raya Indonesia (Ruangguru)
                        </p>
                        
                        <ul className="space-y-1.5 pt-1">
                          <li 
                            className="flex gap-2 items-start text-[11px] leading-relaxed"
                            style={{ color: isDarkTheme ? "#d4d4d8" : "#374151" }}
                          >
                            <span 
                              className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" 
                              style={{ backgroundColor: "#10b981" }}
                            />
                            <span>Animated character assets into video learning projects for elementary school children in grades 4, 5, 6 using Adobe After Effects.</span>
                          </li>
                          <li 
                            className="flex gap-2 items-start text-[11px] leading-relaxed"
                            style={{ color: isDarkTheme ? "#d4d4d8" : "#374151" }}
                          >
                            <span 
                              className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" 
                              style={{ backgroundColor: "#10b981" }}
                            />
                            <span>Worked effectively under tight deadlines while maintaining high visual standards.</span>
                          </li>
                          <li 
                            className="flex gap-2 items-start text-[11px] leading-relaxed"
                            style={{ color: isDarkTheme ? "#d4d4d8" : "#374151" }}
                          >
                            <span 
                              className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" 
                              style={{ backgroundColor: "#10b981" }}
                            />
                            <span>Ensured visual consistency and fluid character movements across multi-episode learning series, contributing to high-quality digital content delivery.</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* REPRESENTATIVE PROJECTS / EVENTS */}
                    <div 
                       className="space-y-2 pt-4 border-t border-dashed"
                      style={{ borderColor: isDarkTheme ? "#1f2937" : "#e5e7eb" }}
                    >
                      <h3 
                        className="font-mono text-[10px] uppercase tracking-widest font-bold"
                        style={{ color: isDarkTheme ? "#71717a" : "#9ca3af" }}
                      >
                        PROJECT EXPERIENCE
                      </h3>
                      <div className="space-y-2 pb-1">
                        {[
                          { date: "APRIL 2026", role: "Motion Designer & Video Editor", title: `Bumper Event: "Mozy App by HK"` },
                          { date: "FEB 2026", role: "Motion Designer & Video Editor", title: `Bumper Event: "Mazda Dealer Excellence Award 2025"` },
                          { date: "OCT 2025", role: "Motion Designer & Video Editor", title: `Commercial Video: "Indofood - Racik Bumbu Special Balado"` },
                          { date: "OCT 2025", role: "Animator & Video Editor", title: `Motion Graphic Animation: "Pengadilan Negeri Cilacap"` },
                          { date: "DEC 2024", role: "Animator & Video Editor", title: `Motion Graphic Animation: "DIRTIK IMIGRASI"` }
                        ].map((proj, pIdx) => (
                          <div key={pIdx} className="flex justify-between items-start text-[10.5px] leading-tight">
                            <div className="flex items-start gap-1.5 flex-1 min-w-0">
                              <span className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: "#10b981" }} />
                              <div className="flex flex-col">
                                <span className="font-bold uppercase text-[10px]" style={{ color: isDarkTheme ? "#ffffff" : "#111827" }}>
                                  {proj.title}
                                </span>
                                <span className="text-[9px] opacity-80" style={{ color: isDarkTheme ? "#a1a1aa" : "#4b5563" }}>
                                  {proj.role}
                                </span>
                              </div>
                            </div>
                            <span className="font-mono text-[8px] tracking-wider shrink-0 text-right opacity-60 ml-2" style={{ color: isDarkTheme ? "#a1a1aa" : "#4b5563" }}>
                              {proj.date}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* HARD SKILLS */}
                    <div 
                      className="space-y-2 pt-4 border-t border-dashed"
                      style={{ borderColor: isDarkTheme ? "#1f2937" : "#e5e7eb" }}
                    >
                      <h3 
                        className="font-mono text-[10px] uppercase tracking-widest font-bold"
                        style={{ color: isDarkTheme ? "#71717a" : "#9ca3af" }}
                      >
                        ADDITIONAL HARD SKILLS & CLIENT STACKS
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Ultra-Wide LED Screen Visuals",
                          "Broadcast Promo Design",
                          "2D Character Rigging & Animation",
                          "Compositing & VFX Cues",
                          "Logo Bumper Animations"
                        ].map((hs, hIdx) => (
                          <span 
                            key={hIdx} 
                            className="px-3 py-1 text-[10px] font-mono tracking-wider rounded uppercase border"
                            style={{
                              backgroundColor: isDarkTheme ? "rgba(0,0,0,0.4)" : "#f9fafb",
                              borderColor: isDarkTheme ? "#1f2937" : "#e5e7eb",
                              color: isDarkTheme ? "#d4d4d8" : "#374151"
                            }}
                          >
                            {hs}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

                {/* CV FOOTER */}
                <div 
                  className="pt-4 border-t flex justify-between items-center text-[9px] font-mono tracking-widest uppercase"
                  style={{
                    borderColor: isDarkTheme ? "#1f2937" : "#e5e7eb",
                    color: isDarkTheme ? "#4b5563" : "#9ca3af",
                    backgroundColor: isDarkTheme ? "#080911" : "#ffffff"
                  }}
                >
                  <span>NUR SOFA FAUZI // CREATIVE DIRECTORY — EDITION 2026</span>
                  <span>AUTOGENERATED PDF VECTOR SPEC</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* HELPER DESKTOP INSTRUCTION FOOTER */}
          <div className="p-3 bg-[#0B0D0F] border-t border-zinc-950 text-center select-none shrink-0 z-30">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              PDF file generated layout represents a standard 1:1.414 format template matching A4 physical paper
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
