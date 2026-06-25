import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { 
  Instagram, 
  Linkedin, 
  Youtube, 
  ArrowUpRight, 
  Mail, 
  ChevronRight, 
  ChevronLeft,
  Play,
  Menu,
  X,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Camera,
  Upload,
  Download,
  FileText
} from "lucide-react";
import React, { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { PROJECTS, Project } from "./constants";
import { ThreeDCarousel } from "./components/ThreeDCarousel";
import { ExportCvModal } from "./components/ExportCvModal";
import defaultLogo from "../Logo.png";
import defaultProfilePhoto from "./sofa_profile.png";
import introVideo from "../LOGO OPENING NUR SOFA FAUZI.mp4";
import rctiLogo from "./rcti_logo.svg";
import ruangguruLogo from "./Ruangguru_logo.svg";

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlayingIntro, setIsPlayingIntro] = useState(true);
  const [isIntroLeaving, setIsIntroLeaving] = useState(false);

  React.useEffect(() => {
    if (isPlayingIntro && !isIntroLeaving) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isPlayingIntro, isIntroLeaving]);

  const handleNextProject = () => {
    if (!selectedProject) return;
    
    // Determine order list based on category section of current project to avoid jumping across sections
    let order: string[] = [];
    if (selectedProject.id === "main-showreel") {
      order = ["main-showreel"];
    } else if (selectedProject.category === "Bumper Event") {
      order = PROJECTS.filter(p => p.category === "Bumper Event" && p.id !== "main-showreel").map(p => p.id);
    } else if (selectedProject.category === "Motion Graphic Animation") {
      order = PROJECTS.filter(p => p.category === "Motion Graphic Animation" && p.id !== "main-showreel").map(p => p.id);
    } else if (selectedProject.category === "Other Project" || selectedProject.category === "Commercial Video") {
      order = PROJECTS.filter(p => (p.category === "Other Project" || p.category === "Commercial Video") && p.id !== "main-showreel").map(p => p.id);
    } else {
      order = PROJECTS.filter(p => p.id !== "main-showreel").map(p => p.id);
    }
    
    if (order.length <= 1) return;
    
    let nextId = order[0];
    const currentIndex = order.indexOf(selectedProject.id);
    
    if (currentIndex !== -1) {
      nextId = order[(currentIndex + 1) % order.length];
    }
    
    const nextProject = PROJECTS.find(p => p.id === nextId);
    if (nextProject) {
      setSelectedProject(nextProject);
    }
  };

  const handlePrevProject = () => {
    if (!selectedProject) return;
    
    // Determine order list based on category section of current project to avoid jumping across sections
    let order: string[] = [];
    if (selectedProject.id === "main-showreel") {
      order = ["main-showreel"];
    } else if (selectedProject.category === "Bumper Event") {
      order = PROJECTS.filter(p => p.category === "Bumper Event" && p.id !== "main-showreel").map(p => p.id);
    } else if (selectedProject.category === "Motion Graphic Animation") {
      order = PROJECTS.filter(p => p.category === "Motion Graphic Animation" && p.id !== "main-showreel").map(p => p.id);
    } else if (selectedProject.category === "Other Project" || selectedProject.category === "Commercial Video") {
      order = PROJECTS.filter(p => (p.category === "Other Project" || p.category === "Commercial Video") && p.id !== "main-showreel").map(p => p.id);
    } else {
      order = PROJECTS.filter(p => p.id !== "main-showreel").map(p => p.id);
    }
    
    if (order.length <= 1) return;
    
    let prevId = order[0];
    const currentIndex = order.indexOf(selectedProject.id);
    
    if (currentIndex !== -1) {
      prevId = order[(currentIndex - 1 + order.length) % order.length];
    }
    
    const prevProject = PROJECTS.find(p => p.id === prevId);
    if (prevProject) {
      setSelectedProject(prevProject);
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent text-zinc-100 selection:bg-emerald-500/30 selection:text-white overflow-x-hidden">
      {/* Cinematic Opening Video or Interactive Animation Overlay */}
      {isPlayingIntro && (
        <CinematicIntro 
          onStartLeaving={() => setIsIntroLeaving(true)} 
          onFinished={() => {
            setIsPlayingIntro(false);
            setIsIntroLeaving(false);
          }} 
        />
      )}

      {/* Backdrop Cyber Grid & Noise Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-20 z-0" />
      
      {/* Structural camera guides (layout margins) */}
      <div className="absolute inset-y-0 left-6 md:left-12 w-[1px] bg-zinc-900/40 pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-6 md:right-12 w-[1px] bg-zinc-900/40 pointer-events-none z-10" />
 
      <Navbar onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} isPlayingIntro={isPlayingIntro} isIntroLeaving={isIntroLeaving} />
      
      <main>
        <HeroSection isPlayingIntro={isPlayingIntro} isIntroLeaving={isIntroLeaving} />
        <ExperienceSection onSelectProject={setSelectedProject} />
        <ShowreelSection onSelect={setSelectedProject} />
        <ProjectGrid onSelect={setSelectedProject} />
      </main>

      <Footer />

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            key={selectedProject.id}
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
            onNext={handleNextProject}
            onPrev={handlePrevProject}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}

function Navbar({ onMenuToggle, isPlayingIntro, isIntroLeaving }: { onMenuToggle: () => void; isPlayingIntro: boolean; isIntroLeaving: boolean }) {
  const isHidden = isPlayingIntro && !isIntroLeaving;
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: isHidden ? -100 : 0, opacity: isHidden ? 0 : 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 md:px-12 bg-zinc-950/70 backdrop-blur-md border-b border-zinc-900/60 shadow-[0_4px_24px_rgba(0,0,0,0.25)] transition-all duration-300"
      style={{ pointerEvents: isHidden ? "none" : "auto" }}
    >
      <div className="text-xl font-display font-black tracking-tighter flex items-center gap-2 text-white">
        NUR SOFA FAUZI
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 duration-1000"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-12 font-display text-sm font-medium tracking-widest text-zinc-400">
        <a href="#experience" className="hover:text-emerald-400 transition-colors">PROFILE</a>
        <a href="#work" className="hover:text-emerald-400 transition-colors">WORK</a>
        <a href="#contact" className="hover:text-emerald-400 transition-colors">CONTACT</a>
      </div>

      <button onClick={onMenuToggle} className="md:hidden text-white hover:text-emerald-400 transition-all">
        <Menu size={24} />
      </button>
    </motion.nav>
  );
}

function RetroTV({ 
  title, 
  icon, 
  scrollToId, 
  tilt, 
  smileSide = "left", 
  badge = "MINE", 
  delay = 0 
}: { 
  title: string; 
  icon: React.ReactNode; 
  scrollToId: string; 
  tilt: number; 
  smileSide?: "left" | "right"; 
  badge?: string; 
  delay?: number; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 40, rotate: tilt - 6 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotate: tilt }}
      transition={{ 
        type: "spring", 
        stiffness: 90, 
        damping: 15, 
        delay: delay 
      }}
      whileHover={{ 
        y: -12, 
        scale: 1.06, 
        rotate: tilt * 0.4, 
        transition: { type: "spring", stiffness: 300, damping: 12 } 
      }}
      onClick={() => {
        const element = document.getElementById(scrollToId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }}
      className="cursor-pointer group relative w-full aspect-[4/3] bg-zinc-100 border-[3px] border-zinc-300 rounded-[18px] shadow-[6px_8px_0px_rgba(16,185,129,0.3),inset_-4px_-4px_0px_#869fa3,inset_3px_3px_0px_#ffffff] p-2 flex flex-col justify-between"
    >
      {/* Super Cute Yellow Smile sticker on Bezel */}
      {smileSide === "left" ? (
        <div className="absolute -top-3 left-4 w-6 h-6 rounded-full bg-yellow-300 border border-yellow-400 flex items-center justify-center text-[10px] rotate-[-12deg] shadow-md z-20 select-none group-hover:scale-110 group-hover:rotate-0 transition-all duration-300">
          😊
        </div>
      ) : (
        <div className="absolute -top-3 right-4 w-6 h-6 rounded-full bg-amber-300 border border-amber-400 flex items-center justify-center text-[10px] rotate-[15deg] shadow-md z-20 select-none group-hover:scale-110 group-hover:rotate-0 transition-all duration-300">
          ⭐
        </div>
      )}

      {/* Styled badge sticker on Bezel */}
      <div className="absolute -bottom-2.5 right-4 bg-rose-400 text-white font-bold font-sans text-[7px] tracking-tight px-1.5 py-0.5 rounded-[4px] border border-rose-500 rotate-[8deg] shadow-sm z-20 select-none uppercase group-hover:scale-110 transition-transform duration-300">
        {badge}
      </div>

      {/* Main Face Container */}
      <div className="flex h-full w-full gap-1.5">
        {/* Glow-Tube CRT Screen */}
        <div className="w-[76%] h-full bg-[#04120f] border-2 border-slate-400 rounded-[11px] overflow-hidden relative shadow-[inset_0_0_12px_rgba(0,0,0,0.95)] flex flex-col items-center justify-center p-2">
          {/* Phosphor glass gradient background with hover screen brightening */}
          <div className="absolute inset-0 bg-radial-gradient bg-gradient-to-b from-emerald-800/80 to-teal-950/95 group-hover:from-emerald-700/90 group-hover:to-teal-900 transition-all duration-300" />
          
          {/* Phosphor glowing center */}
          <div className="absolute w-[80%] aspect-square rounded-full bg-emerald-400/20 blur-[20px] pointer-events-none group-hover:bg-emerald-300/35 transition-all duration-300" />

          {/* Retro phosphor Scanline list overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.22)_50%)] bg-[size:100%_4px] pointer-events-none opacity-90 mix-blend-overlay" />

          {/* Screen Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full w-full gap-1">
            {/* Pulsating Glowing Icon */}
            <motion.div 
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: delay * 0.5 }}
              className="flex justify-center items-center h-[52%] w-full"
            >
              {icon}
            </motion.div>

            {/* Glowing Retro Text */}
            <div className="font-display font-semibold text-center text-[10px] md:text-[11px] leading-tight text-white tracking-wide uppercase drop-shadow-[0_0_5px_rgba(16,185,129,0.7)] h-[35%] flex items-center justify-center">
              {title}
            </div>
          </div>

          {/* Glare Glass reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none rounded-[9px]" />
        </div>

        {/* Right TV control hardware panel */}
        <div className="w-[24%] h-full flex flex-col items-center justify-start py-1.5 gap-2.5 bg-slate-200/50 rounded-[4px] border border-slate-300/50">
          {/* Small knobs */}
          <div className="w-4 h-4 bg-slate-300 rounded-full border border-slate-400 shadow-inner flex items-center justify-center relative cursor-pointer active:scale-95 transition-transform duration-100">
            <div className="w-1 h-2 bg-slate-500 rounded-full absolute top-0" style={{ transform: "rotate(30deg) translateY(-0.5px)" }} />
          </div>
          <div className="w-4 h-4 bg-slate-300 rounded-full border border-slate-400 shadow-inner flex items-center justify-center relative cursor-pointer active:scale-95 transition-transform duration-100">
            <div className="w-1 h-2 bg-slate-500 rounded-full absolute top-0" style={{ transform: "rotate(-45deg) translateY(-0.5px)" }} />
          </div>

          {/* Speaker slots */}
          <div className="flex flex-col gap-0.5 w-[60%] my-1 select-none">
            <div className="h-[2px] bg-slate-300 rounded-full" />
            <div className="h-[2px] bg-slate-300 rounded-full" />
            <div className="h-[2px] bg-slate-300 rounded-full" />
            <div className="h-[2px] bg-slate-300 rounded-full" />
          </div>

          {/* Blinking indicator LED */}
          <div className="flex flex-col items-center justify-end flex-grow">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.9)] animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HeroSection({ isPlayingIntro, isIntroLeaving }: { isPlayingIntro: boolean; isIntroLeaving: boolean }) {
  const isHidden = isPlayingIntro && !isIntroLeaving;
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const [kineticIndex, setKineticIndex] = useState(0);
  const kineticWords = [
    "PORTFOLIO",
    "DESIGNER",
    "ANIMATOR",
    "SHOWREELS",
    "CREATOR"
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setKineticIndex((prev) => (prev + 1) % kineticWords.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Dynamic logo search path to automatically load user's real logo file once uploaded
  const logoPaths = [
    defaultLogo,
    "/Logo.png",
    "/logo.png",
    "/src/logo.png",
    "/logo.jpg",
    "/logo.jpeg",
    "/logo.svg",
    "/logo.webp",
    "/nsf_logo.png",
    "/nsf-logo.png",
    "/nsf-design.png",
    "/nsf_design.png"
  ];
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  const [logoErrorAll, setLogoErrorAll] = useState(false);

  const handleLogoError = () => {
    if (currentLogoIndex < logoPaths.length - 1) {
      setCurrentLogoIndex(prev => prev + 1);
    } else {
      setLogoErrorAll(true);
    }
  };

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen flex flex-col justify-center items-center pt-28 pb-16 px-6 md:px-12 overflow-hidden bg-transparent gap-8 md:gap-14"
    >
      {/* Blueprint Grid Blueprint Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 z-0 bg-transparent"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.08) 1.5px, transparent 1.5px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.08) 1.5px, transparent 1.5px)
          `,
          backgroundSize: "45px 45px"
        }}
      />

      {/* Cyber/Technical Blueprint Corner Accents */}
      <motion.div
        animate={{ opacity: isHidden ? 0 : 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 pointer-events-none z-10 select-none pb-6"
      >
        {/* Diamond sparkling points inside corners */}
        <div className="absolute top-28 left-6 md:left-12 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
          <span className="text-emerald-400 font-mono text-sm select-none font-bold animate-pulse">◆</span>
          <span className="absolute left-4 font-mono text-[8px] text-emerald-500/50 uppercase tracking-widest hidden sm:inline whitespace-nowrap">CAM_01 // SEC_02</span>
        </div>
        <div className="absolute top-28 right-6 md:right-12 translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
          <span className="text-emerald-400 font-mono text-sm select-none font-bold animate-pulse">◆</span>
          <span className="absolute right-4 font-mono text-[8px] text-emerald-500/50 uppercase tracking-widest hidden sm:inline whitespace-nowrap">VIEWPOINT_SYS // BP_04</span>
        </div>
        <div className="absolute bottom-12 left-6 md:left-12 -translate-x-1/2 translate-y-1/2 z-20 flex items-center justify-center">
          <span className="text-emerald-400 font-mono text-sm select-none font-bold">◆</span>
        </div>
        <div className="absolute bottom-12 right-6 md:right-12 translate-x-1/2 translate-y-1/2 z-20 flex items-center justify-center">
          <span className="text-emerald-400 font-mono text-sm select-none font-bold">◆</span>
        </div>

        {/* Live Active Coordinates */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-left z-20 font-mono text-[8px] text-emerald-500/40 tracking-[0.3em] uppercase hidden xl:flex items-center gap-3">
          <span className="w-3 h-[1px] bg-emerald-400" />
          SYS_CRT_GRID // COORD_Z: 4096.22X // SYSTEM_DEPLOYED_STABLE
        </div>
      </motion.div>

      {/* Floating Retro Designer Handwork Vector Accents */}
      {!isHidden && (
        <div className="absolute inset-0 pointer-events-none z-10 select-none overflow-hidden">
          {/* Eyedropper / Pipette */}
          <motion.div 
            animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            className="absolute left-[38%] top-[55%] hidden xl:block text-emerald-500/30"
          >
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M11 4l8 8M18 11.5l1.5-1.5a2.5 2.5 0 0 0-3.5-3.5L14.5 8M9 16l-5 5h-1v-1l5-5M15 11l-5.5 5.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>

          {/* Graphic calligraphy pen tool */}
          <motion.div 
            animate={{ y: [0, 8, 0], rotate: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute right-[33%] top-[48%] hidden xl:block text-emerald-500/30"
          >
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM12 8v8M9 11h6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>

          {/* Big Letter T Text Tool */}
          <motion.div 
            animate={{ y: [0, -6, 0], scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
            className="absolute left-[8%] bottom-[42%] hidden xl:block text-emerald-500/25 font-display font-black text-5xl"
          >
            T
          </motion.div>

          {/* Compass / Painting brush tool representation */}
          <motion.div 
            animate={{ y: [0, 6, 0], rotate: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 0.5 }}
            className="absolute right-[12%] bottom-[25%] hidden xl:block text-emerald-500/35"
          >
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M18 22H6M12 2v20M12 2A10 10 0 0 1 22 12M12 2A10 10 0 0 0 2 12" strokeLinecap="round"/>
            </svg>
          </motion.div>

          {/* Giga-Retro 8-Bit Checkerboard Accent Left */}
          <div className="absolute left-[5%] top-[18%] w-10 h-24 opacity-[0.25] hidden xl:flex flex-col gap-0.5">
            <div className="grid grid-cols-4 gap-0.5 w-full h-full">
              {Array.from({ length: 24 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`aspect-square rounded-[3px] ${
                    ((Math.floor(i / 4) + (i % 4)) % 2 === 0) 
                      ? "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]" 
                      : "bg-transparent"
                  }`} 
                />
              ))}
            </div>
          </div>

          {/* Giga-Retro 8-Bit Checkerboard Accent Right */}
          <div className="absolute right-[5%] top-[22%] w-10 h-24 opacity-[0.25] hidden xl:flex flex-col gap-0.5">
            <div className="grid grid-cols-4 gap-0.5 w-full h-full">
              {Array.from({ length: 24 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`aspect-square rounded-[3px] ${
                    ((Math.floor(i / 4) + (i % 4)) % 2 === 1) 
                      ? "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]" 
                      : "bg-transparent"
                  }`} 
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Center Blueprint Header Panel */}
      <motion.div 
        style={{ y, opacity: scrollOpacity }} 
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-center items-center pointer-events-none mt-6"
      >
        <motion.div
          animate={{ opacity: isHidden ? 0 : 1, y: isHidden ? 30 : 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col items-center justify-center text-center relative"
        >
          {/* Centered Glowing Sofa's Official Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isHidden ? 0 : 1, scale: isHidden ? 0.8 : 1 }}
            transition={{ duration: 1.1, delay: 0.3 }}
            className="relative flex items-center justify-center mb-4 z-20 pointer-events-auto"
          >
            {/* Ambient Spinning Orbit Outline */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[90px] h-[90px] md:w-[112px] md:h-[112px] rounded-full border border-dashed border-emerald-400/25 animate-spin duration-[30000ms]" />
            </div>

            {!logoErrorAll ? (
              <img 
                src={logoPaths[currentLogoIndex]} 
                alt="NSF Design Logo" 
                onError={handleLogoError}
                referrerPolicy="no-referrer"
                className="w-20 h-20 md:w-24 md:h-24 object-contain select-none pointer-events-none transition-all duration-300"
                style={{
                  filter: "brightness(0) invert(1) drop-shadow(0 0 4px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 12px rgba(16, 185, 129, 0.6))"
                }}
              />
            ) : (
              <svg viewBox="0 0 300 300" className="w-20 h-20 md:w-24 md:h-24 drop-shadow-[0_0_16px_rgba(16,185,129,0.4)]" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logoGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
                <circle 
                  cx="150" 
                  cy="140" 
                  r="84" 
                  stroke="#ffffff" 
                  strokeWidth="2.5" 
                  fill="none" 
                  style={{ filter: "drop-shadow(0 0 6px rgba(16,185,129,0.5))" }}
                />
                <path 
                  d="M 68 185 L 68 85 L 118 185 L 118 85" 
                  stroke="#ffffff" 
                  strokeWidth="18" 
                  strokeLinecap="square" 
                  strokeLinejoin="miter"
                  fill="none" 
                  style={{ filter: "drop-shadow(0 0 6px rgba(16,185,129,0.6))" }}
                />
                <path 
                  d="M 172 105 C 172 87, 126 87, 126 116 C 126 142, 172 136, 172 159 C 172 187, 122 187, 122 170" 
                  stroke="#ffffff" 
                  strokeWidth="18" 
                  strokeLinecap="square" 
                  strokeLinejoin="round"
                  fill="none" 
                  style={{ filter: "drop-shadow(0 0 6px rgba(16,185,129,0.6))" }}
                />
                <path 
                  d="M 198 185 L 198 85 L 242 85 M 198 131 L 228 131" 
                  stroke="#ffffff" 
                  strokeWidth="18" 
                  strokeLinecap="square" 
                  strokeLinejoin="miter"
                  fill="none" 
                  style={{ filter: "drop-shadow(0 0 6px rgba(16,185,129,0.6))" }}
                />
              </svg>
            )}
          </motion.div>

          {/* Subtitle Bumper Tag */}
          <div className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] text-emerald-400 font-bold uppercase mb-2">
            CREATIVE MOTION DESIGNER & ANIMATOR
          </div>

          {/* Bold Sans-Serif Glowing Big Title with kinetic rotating text - BEAUTIFUL ASYMMETRICAL EDIT */}
          <div className="relative flex flex-col items-center justify-center py-10 sm:py-12 w-full select-none overflow-visible">
            {/* Blueprint grid line structure crossing asymmetrically */}
            <div className="absolute w-[90%] h-[1px] bg-emerald-500/12 top-1/2 left-[5%]" />
            <div className="absolute w-[1px] h-28 bg-emerald-500/8 left-[15%] top-0" />
            <div className="absolute w-[1px] h-28 bg-emerald-500/8 right-[25%] bottom-0" />

            {/* Asymmetrical Frame Container */}
            <div className="relative z-10 flex flex-col w-full max-w-[320px] sm:max-w-[480px] md:max-w-[620px] lg:max-w-[720px] mx-auto px-2 gap-0 overflow-visible">
              
              {/* Upper-Left Aligned: MOTION */}
              <div className="flex items-baseline gap-3 self-start pl-1 sm:pl-4 md:pl-8 z-10">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                  className="font-display font-black text-[13.5vw] sm:text-[11vw] md:text-[9.5vw] lg:text-[8.5vw] xl:text-[9vw] text-white leading-none tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] uppercase"
                >
                  MOTION
                </motion.h1>
              </div>

              {/* Lower-Right Aligned Kinetic Text inside size-matched container with negative margin for overlapping/tighter look */}
              <div className="flex items-center justify-end self-end pr-1 sm:pr-4 md:pr-8 h-[10vw] sm:h-[8.5vw] md:h-[7.5vw] lg:h-[6.8vw] xl:h-[7.2vw] relative overflow-visible w-full mt-[-1.5vw] sm:mt-[-2vw] md:mt-[-2.5vw] z-20">
                <div className="relative w-full text-right h-full min-w-[200px] sm:min-w-[300px] flex items-center justify-end">
                  <div className="relative h-full inline-block min-w-[140px] sm:min-w-[220px] md:min-w-[280px]">
                    <AnimatePresence mode="popLayout">
                      <motion.span 
                        key={kineticIndex}
                        initial={{ rotateX: 90, opacity: 0, scale: 0.95 }}
                        animate={{ rotateX: 0, opacity: 1, scale: 1 }}
                        exit={{ rotateX: -90, opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="absolute right-0 top-0 font-display font-black tracking-tighter text-[10vw] sm:text-[8.5vw] md:text-[7.5vw] lg:text-[6.8vw] xl:text-[7.2vw] text-transparent [-webkit-text-stroke:1px_rgba(52,211,153,0.9)] sm:[-webkit-text-stroke:1.8px_rgba(52,211,153,0.95)] drop-shadow-[0_0_15px_rgba(16,185,129,0.55)] uppercase whitespace-nowrap leading-none"
                      >
                        {kineticWords[kineticIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

            </div>
          </div>



          {/* Exploration Action capsule buttons */}
          <div className="mt-6 sm:mt-8 md:mt-12 pointer-events-auto z-20">
            <button 
              className="px-6 py-2 border border-emerald-400/80 hover:border-emerald-400 bg-emerald-950/40 text-emerald-200 font-display font-medium text-xs tracking-[0.2em] rounded-[6px] transition-all duration-300 hover:shadow-[0_0_18px_rgba(16,185,129,0.5)] hover:bg-emerald-900/30 hover:scale-105 uppercase cursor-pointer"
              onClick={() => {
                const worksSection = document.getElementById("work");
                if (worksSection) {
                  worksSection.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
            >
              Table of contents
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Retro CRT TV Monitors Grid / Bento layout */}
      <div className="relative z-10 w-full max-w-5xl mx-auto my-2 pointer-events-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-2 sm:px-6">
          <RetroTV
            title="Profile"
            scrollToId="experience"
            tilt={-5}
            smileSide="left"
            badge="SOFA"
            delay={0.1}
            icon={
              <svg viewBox="0 0 100 100" className="w-10 h-10 text-emerald-300 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="50" cy="50" r="32" />
                <path d="M22 42 Q35 24 50 32 Q65 24 78 42" stroke="currentColor" fill="none" strokeLinecap="round" />
                <circle cx="38" cy="48" r="3.5" fill="currentColor" className="animate-pulse" />
                <circle cx="62" cy="48" r="3.5" fill="currentColor" className="animate-pulse" />
                <circle cx="28" cy="56" r="2.5" fill="#ff7096" stroke="none" />
                <circle cx="72" cy="56" r="2.5" fill="#ff7096" stroke="none" />
                <path d="M42 58 Q50 67 58 58" stroke="currentColor" strokeLinecap="round" fill="none" />
              </svg>
            }
          />

          <RetroTV
            title="Showreel"
            scrollToId="showreel"
            tilt={6}
            smileSide="right"
            badge="BRANDS"
            delay={0.2}
            icon={
              <svg viewBox="0 0 100 100" className="w-10 h-10 text-emerald-300 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Board main plate */}
                <rect x="20" y="46" width="60" height="32" rx="3" />
                
                {/* Horizontal slate divisions */}
                <line x1="20" y1="58" x2="80" y2="58" />
                <line x1="40" y1="58" x2="40" y2="78" />
                <line x1="60" y1="58" x2="60" y2="78" />
                
                {/* Decorative slate writing lines */}
                <line x1="25" y1="52" x2="35" y2="52" strokeWidth="1.5" />
                <line x1="45" y1="52" x2="55" y2="52" strokeWidth="1.5" />
                <line x1="65" y1="52" x2="75" y2="52" strokeWidth="1.5" />
                
                {/* Static base clapper zebra bar */}
                <path d="M20 40 h60 v6 h-60 z" fill="currentColor" fillOpacity="0.1" />
                <line x1="25" y1="40" x2="31" y2="46" strokeWidth="2" />
                <line x1="37" y1="40" x2="43" y2="46" strokeWidth="2" />
                <line x1="49" y1="40" x2="55" y2="46" strokeWidth="2" />
                <line x1="61" y1="40" x2="67" y2="46" strokeWidth="2" />
                <line x1="73" y1="40" x2="79" y2="46" strokeWidth="2" />
                
                {/* Tilted upper clapper bar (open / action state) */}
                <g transform="rotate(-15 20 40)">
                  <rect x="20" y="32" width="60" height="6.5" rx="1.5" fill="currentColor" fillOpacity="0.2" />
                  <line x1="25" y1="32" x2="31" y2="38.5" strokeWidth="2" />
                  <line x1="37" y1="32" x2="43" y2="38.5" strokeWidth="2" />
                  <line x1="49" y1="32" x2="55" y2="38.5" strokeWidth="2" />
                  <line x1="61" y1="32" x2="67" y2="38.5" strokeWidth="2" />
                  <line x1="73" y1="32" x2="79" y2="38.5" strokeWidth="2" />
                </g>
                
                {/* Pivot hinge joint */}
                <circle cx="20" cy="40" r="2.5" fill="#10b981" />
              </svg>
            }
          />

          <RetroTV
            title="Selected Project"
            scrollToId="work"
            tilt={-4}
            smileSide="left"
            badge="BUMPER"
            delay={0.3}
            icon={
              <svg viewBox="0 0 100 100" className="w-10 h-10 text-emerald-300 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="20" y="32" width="40" height="34" rx="4" />
                <polygon points="63,40 82,30 82,68 63,58" fill="none" />
                <circle cx="32" cy="49" r="5" strokeDasharray="2 1" />
                <circle cx="48" cy="49" r="5" strokeDasharray="2 1" />
              </svg>
            }
          />

          <RetroTV
            title="Social Media"
            scrollToId="contact"
            tilt={8}
            smileSide="right"
            badge="ONLINE"
            delay={0.4}
            icon={
              <div className="flex flex-col items-center justify-center gap-1.5 w-full">
                <svg viewBox="0 0 100 100" className="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="50" cy="50" r="26" strokeDasharray="3 3" />
                  <path d="M25 50 Q50 30 75 50 Q50 70 25 50" />
                  <line x1="50" y1="24" x2="50" y2="76" />
                  <circle cx="50" cy="50" r="4" fill="currentColor" />
                </svg>
                <div className="flex gap-1 items-center justify-center text-emerald-400">
                  <Instagram size={10} className="stroke-[2.5]" />
                  <Youtube size={10} className="stroke-[2.5]" />
                  <Linkedin size={10} className="stroke-[2.5]" />
                </div>
              </div>
            }
          />
        </div>
      </div>

      {/* Decorative background spotlights — Dual ambient emerald/green spotlights */}
      <div className="absolute top-1/4 right-[-10%] w-[55%] aspect-square rounded-full bg-emerald-950/10 blur-[130px] -z-10 animate-pulse duration-[12000ms] pointer-events-none" />
      <div className="absolute bottom-1/4 left-[-10%] w-[45%] aspect-square rounded-full bg-emerald-500/5 blur-[125px] -z-10 animate-pulse duration-[10000ms] pointer-events-none" />
    </section>
  );
}

function HoverProjectCard({ project, idx, onSelect }: { project: Project; idx: number; onSelect: (p: Project) => void; key?: any }) {
  const [isHovered, setIsHovered] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const timerRef = useRef<any>(null);

  const videoId = project.videoUrl && !project.videoUrl.includes("videoseries") ? project.videoUrl.split("/").pop() : "";

  const handleMouseEnter = () => {
    setIsHovered(true);
    // 150ms responsive delay to screen out erratic mouse passes
    timerRef.current = setTimeout(() => {
      setHasLoaded(true);
    }, 150);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: idx * 0.1 }}
      onClick={() => onSelect(project)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-[82vw] sm:w-[50vw] md:w-[45vw] lg:w-[32vw] xl:w-[25vw] max-w-[480px] shrink-0 snap-start select-none cursor-pointer group"
    >
      {/* Project card wrapper */}
      <div className="relative aspect-video overflow-hidden rounded-md bg-zinc-950 border border-zinc-900 transition-all duration-500 group-hover:border-emerald-500/35 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.06)]">
        {/* If hovered, fade-in the autoplaying looping preview iframe */}
        {hasLoaded && videoId && (
          <div className={`absolute inset-0 z-0 pointer-events-none scale-[1.01] origin-center select-none bg-zinc-950 transition-opacity duration-300 ${isHovered ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            {/* Live indicator tag */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-black/85 px-2 py-1 rounded-full border border-emerald-500/20 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-mono text-[7px] tracking-widest text-emerald-400 uppercase font-black">STREAM PREVIEW</span>
            </div>
            
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&enablejsapi=1`}
              className="w-full h-full border-none pointer-events-none"
              title={`${project.title} Preview Frame`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              draggable="false"
            />
          </div>
        )}

        {/* Static image layer with subtle scale hover response */}
        <motion.img 
          src={project.thumbnailUrl} 
          alt={project.title}
          className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'opacity-0' : 'opacity-85'}`}
          style={{
            transform: [
              "mazda-excellence-2024",
              "mandiri-golfcard-2025",
              "mandiri-golfcard-2025-award",
              "padi-umkm-empower",
              "imigrasi-services",
              "adab-sunnah-tpa",
              "rcti-showreel",
              "iodine-malnutrition-indonesia",
              "wootag-intent-ai",
              "pln-public-safety",
              "speequal-profile",
              "speequal-gaming-profile",
              "star-corporate-profile",
              "anggur-merah-launching"
            ].includes(project.id)
              ? (isHovered ? "scale(1.20)" : "scale(1.15)")
              : (isHovered ? "scale(1.05)" : "scale(1.0)")
          }}
          draggable="false"
        />

        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent opacity-85 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none z-10" />
        
        {/* Hover action icon trigger indicator */}
        <div className="absolute top-6 right-6 overflow-hidden z-20 pointer-events-none">
          <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-black p-3 rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.35)]">
            <ArrowUpRight size={16} />
          </div>
        </div>

        {/* Info labels / overlay typography */}
        <div className="absolute bottom-6 left-6 right-6 pointer-events-none z-20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-[1px] bg-emerald-500/60" />
              <span className="text-[9px] font-mono tracking-[0.15em] uppercase text-emerald-400">{project.date}</span>
            </div>
            {project.episodes && (
              <span className="text-[8px] font-mono font-bold tracking-widest bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded text-emerald-300">
                PLAYLIST
              </span>
            )}
          </div>
          <h4 className="text-lg md:text-xl font-display font-medium leading-tight text-white group-hover:text-emerald-300 transition-colors duration-300">{project.title}</h4>
        </div>
      </div>
    </motion.div>
  );
}function ProjectGrid({ onSelect }: { onSelect: (p: Project) => void }) {
  const [activeCategoryIndexes, setActiveCategoryIndexes] = useState<Record<string, number>>({
    "bumper-event": 0,
    "motion-animation": 0,
    "other-projects": 0,
  });

  const categories = [
    {
      id: "bumper-event",
      num: "01",
      title: "Bumper Event",
      description: "High-impact visual openings, dynamic launch sequences, and seamless transitions engineered for corporate events, award shows, and large-scale digital milestones.",
      projects: PROJECTS.filter(p => p.category === "Bumper Event" && p.id !== "main-showreel")
    },
    {
      id: "motion-animation",
      num: "02",
      title: "Motion Graphic Animation",
      description: "Concept-driven 2D character assets, institutional guides, and smooth graphic storytelling.",
      projects: PROJECTS.filter(p => p.category === "Motion Graphic Animation" && p.id !== "main-showreel")
    },
    {
      id: "other-projects",
      num: "03",
      title: "Other Project",
      description: "Engaging commercial animations and premium product promos, designed to capture attention and drive audience action across multiple platforms.",
      projects: PROJECTS.filter(p => (p.category === "Other Project" || p.category === "Commercial Video") && p.id !== "main-showreel")
    }
  ];

  const handlePrev = (catId: string, count: number) => {
    setActiveCategoryIndexes(prev => ({
      ...prev,
      [catId]: (prev[catId] - 1 + count) % count
    }));
  };

  const handleNext = (catId: string, count: number) => {
    setActiveCategoryIndexes(prev => ({
      ...prev,
      [catId]: (prev[catId] + 1) % count
    }));
  };

  return (
    <section id="work" className="relative px-6 md:px-12 py-16 md:py-20 border-t border-zinc-900/40 bg-transparent">
      {/* SECTION TITLE & HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-8">
        <div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-white">SELECTED <br /> PROJECTS</h2>
          <p className="text-zinc-400 font-mono text-xs tracking-widest uppercase">2021 — 2026</p>
        </div>
        <p className="max-w-sm text-zinc-400 text-sm font-light leading-relaxed">
          A collection of motion graphics, commercial videos, and animated assets delivered for high-profile clients and events.
        </p>
      </div>

      {/* CATEGORIES CONTAINER */}
      <div className="space-y-16 md:space-y-20">
        {categories.map((cat) => {
          const currentActive = activeCategoryIndexes[cat.id] ?? 0;

          return (
            <div 
              key={cat.id} 
              className="isolate relative rounded-2xl border bg-[#070913] overflow-hidden transition-all duration-300 shadow-[0_22px_60px_rgba(0,0,0,0.85)] border-emerald-500/10 flex flex-col"
            >
              {/* macOS Browser Header Mockup */}
              <div className="w-full h-10 sm:h-11 bg-[#161720] border-b border-zinc-950/50 px-3 sm:px-4 flex items-center justify-between select-none shrink-0 pointer-events-auto z-20">
                {/* Left controls */}
                <div className="flex items-center gap-3.5 sm:gap-4">
                  {/* Window control lights */}
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  
                  {/* Sidebar toggle icon */}
                  <div className="hidden sm:flex items-center gap-1 text-zinc-500/80">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M9 3v18" />
                    </svg>
                    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 translate-y-[0.5px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>

                  {/* Navigation Back & Forward glyphs */}
                  <div className="hidden md:flex items-center gap-3 text-zinc-600 ml-1">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 cursor-not-allowed hover:text-zinc-500" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 cursor-not-allowed hover:text-zinc-500" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </div>
                </div>

                {/* Centered browser search / url identifier bar */}
                <div className="flex-1 max-w-xs sm:max-w-md mx-3">
                  <div className="w-full h-6 sm:h-7 bg-[#23242e]/80 border border-zinc-950/25 rounded-md flex items-center justify-start px-2 sm:px-3 text-zinc-500">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </div>
                </div>

                {/* Right toolbar controls */}
                <div className="flex items-center gap-3 sm:gap-4 text-zinc-500">
                  {/* Share */}
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 cursor-pointer hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" x2="12" y1="2" y2="15" />
                  </svg>

                  {/* Plus */}
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 cursor-pointer hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" x2="12" y1="5" y2="19" />
                    <line x1="5" x2="19" y1="12" y2="12" />
                  </svg>

                  {/* Tab Grid layers */}
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 cursor-pointer hover:text-[#06b6d4] transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="12" height="12" x="8" y="8" rx="1.5" />
                    <path d="M4 12V6a2 2 0 0 1 2-2h6" />
                  </svg>
                </div>
              </div>

              {/* Dynamic 10% blurred background corresponding to active category project */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 rounded-2xl select-none">
                <AnimatePresence mode="popLayout">
                  {cat.projects[currentActive] && (
                    <motion.div
                      key={cat.projects[currentActive].id}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 0.55, scale: 1.0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <div 
                        className="w-full h-full bg-cover bg-center bg-no-repeat filter blur-[4px]"
                        style={{ backgroundImage: `url(${cat.projects[currentActive].thumbnailUrl})` }}
                      />
                      {/* Vignettes and overlays to ensure perfect content readability and elegance */}
                      <div className="absolute inset-0 bg-neutral-900/10" />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950" />
                      <div className="absolute inset-0 bg-zinc-950/25" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Main content body with padding */}
              <div className="p-6 md:p-10 pt-4 md:pt-6 space-y-4 md:space-y-6 relative flex-1 flex flex-col justify-between">
                {/* Category Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-900/60 pb-6 gap-6 z-10 relative">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-zinc-400 tracking-wider font-bold">{cat.num} //</span>
                      <h3 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase">{cat.title}</h3>
                    </div>
                    <p className="max-w-xl text-zinc-400 text-xs md:text-sm font-light leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>

                {/* 3D Carousel container with side buttons */}
                <div className="z-10 relative px-0 sm:px-14 md:px-16">
                  <ThreeDCarousel
                    projects={cat.projects}
                    onSelect={onSelect}
                    activeIndex={currentActive}
                    setActiveIndex={(idx) => setActiveCategoryIndexes(prev => ({ ...prev, [cat.id]: idx }))}
                  />

                  {/* Left Side Navigation Button */}
                  <div className="absolute left-0 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 pointer-events-none">
                    <button
                      onClick={() => handlePrev(cat.id, cat.projects.length)}
                      className="pointer-events-auto flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full border border-emerald-500/40 bg-zinc-950/90 hover:bg-[#060b1a]/95 hover:border-cyan-400 hover:text-cyan-400 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(34,211,238,0.55)] hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft size={26} className="md:w-7 md:h-7 shrink-0" strokeWidth={3} />
                    </button>
                  </div>

                  {/* Right Side Navigation Button */}
                  <div className="absolute right-0 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 pointer-events-none">
                    <button
                      onClick={() => handleNext(cat.id, cat.projects.length)}
                      className="pointer-events-auto flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full border border-emerald-500/40 bg-zinc-950/90 hover:bg-[#060b1a]/95 hover:border-cyan-400 hover:text-cyan-400 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(34,211,238,0.55)] hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none"
                      aria-label="Scroll right"
                    >
                      <ChevronRight size={26} className="md:w-7 md:h-7 shrink-0" strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ExperienceSection({ onSelectProject }: { onSelectProject?: (project: Project) => void }) {
  const [activeTab, setActiveTab] = useState<"experience" | "education" | "skills">("experience");
  const [hoveredVideoIdx, setHoveredVideoIdx] = useState<number | null>(null);
  const [isExportCvModalOpen, setIsExportCvModalOpen] = useState(false);

  const skillsList = [
    { name: "Adobe After Effects", level: "Expert", percentage: 95 },
    { name: "Adobe Photoshop", level: "Expert", percentage: 90 },
    { name: "CapCut Pro", level: "Skillful", percentage: 85 },
    { name: "Adobe Illustrator", level: "Skillful", percentage: 80 },
    { name: "Adobe Premiere Pro", level: "Skillful", percentage: 85 }
  ];

  const experiences = [
    {
      role: "Motion Graphic Designer",
      company: "PT. MNC Digital Indonesia (RCTI+)",
      period: "October 2022 — Present",
      bullets: [
        "Conceptualize and execute high-fidelity motion graphics and digital video assets to drive user acquisition and engagement for the RCTI+ OTT platform.",
        "Collaborate closely with creative directors and marketing teams to translate promotional briefs into dynamic on-air bumpers, social media campaigns, and digital platform visuals.",
        "Maintain strict broadcast quality standards while managing multiple high-priority promotional projects simultaneously under tight broadcasting schedules."
      ],
      videoUrl: "https://www.youtube.com/embed/YnU4a_GdGTA?autoplay=1&mute=1&loop=1&playlist=YnU4a_GdGTA&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1",
      projectId: "rcti-showreel",
      logo: rctiLogo
    },
    {
      role: "Animator Motion Graphic",
      company: "PT. Ruang Raya Indonesia (Ruangguru)",
      period: "May 2021 — September 2022",
      bullets: [
        "Animated character assets into video learning projects for elementary school children in grades 4, 5, 6 using Adobe After Effects.",
        "Worked effectively under tight deadlines while maintaining high visual standards.",
        "Ensured visual consistency and fluid character movements across multi-episode learning series, contributing to high-quality digital content delivery."
      ],
      videoUrl: "https://www.youtube.com/embed/e1-VRh6km4c?autoplay=1&mute=1&loop=1&playlist=e1-VRh6km4c&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1",
      projectId: "ruangguru-dafa-lulu",
      logo: ruangguruLogo
    }
  ];

  return (
    <section id="experience" className="relative px-6 md:px-12 py-16 md:py-20 bg-transparent border-t border-zinc-900/40">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-8">
        <div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-white">
            PROFILE
          </h2>
          <p className="text-zinc-400 font-mono text-xs tracking-widest uppercase">
            Curriculum Vitae — 2026 Edition
          </p>
        </div>
        <p className="max-w-md text-zinc-400 font-light leading-relaxed">
          Creative and detail-oriented professional with a strong interest in art and design. Holds a Bachelor's Degree in Visual Art Education.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* LEFT COLUMN: INTERACTIVE PROFILE CARD & DETAILS */}
        <div className="lg:col-span-3 space-y-8 lg:sticky lg:top-32">
          
          {/* PROFILE PHOTO CONTAINER (FRAMELESS) */}
          <div className="group relative aspect-[4/5] flex items-center justify-center overflow-visible select-none py-12">
            <img 
              src={defaultProfilePhoto} 
              alt="Nur Sofa Fauzi" 
              className="max-w-full max-h-full object-contain select-none z-10 filter drop-shadow-[0_20px_50px_rgba(16,185,129,0.25)] scale-[1.60] hover:scale-[1.65] grayscale hover:grayscale-0 group-hover:grayscale-0 transition-all duration-700 ease-out" 
            />
          </div>

          {/* QUICK PERSONAL STATS */}
          <div className="p-6 bg-zinc-950/20 border border-zinc-900 rounded-lg space-y-6">
            <h3 className="font-display font-bold text-xs tracking-widest text-zinc-400 uppercase">CONTACT & PROFILE</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-2 border border-zinc-900 bg-black rounded-lg text-zinc-500">
                  <MapPin size={16} />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">LOCATION</div>
                  <div className="text-sm text-zinc-300">Jakarta Timur, Indonesia</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2 border border-zinc-900 bg-black rounded-lg text-zinc-500">
                  <Phone size={16} />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">PHONE</div>
                  <a href="tel:081213791137" className="text-sm text-zinc-300 hover:text-white transition-colors">081213791137</a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2 border border-zinc-900 bg-black rounded-lg text-zinc-500">
                  <Mail size={16} />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">EMAIL</div>
                  <a href="mailto:sofafauzi@gmail.com" className="text-sm text-zinc-300 hover:text-white transition-colors">sofafauzi@gmail.com</a>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-zinc-900 flex justify-between items-center text-xs">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">RESUME FORMAT</span>
              <a 
                href="https://drive.google.com/file/d/1Zq1AUhOKNLDA6Fw4_U-7PB1ir99ANkf0/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-display font-bold text-emerald-400 hover:text-emerald-300 hover:underline transition-all cursor-pointer"
                title="View PDF CV in a new tab"
              >
                VIEW ORIGINAL CV <span className="font-mono text-[9px] text-emerald-500/60 font-normal tracking-wide ml-1">(PDF)</span>
              </a>
            </div>

            <div className="pt-4 border-t border-zinc-900">
              <button
                onClick={() => setIsExportCvModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-400 hover:border-emerald-400/50 hover:from-emerald-500/20 hover:to-teal-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] transition-all duration-300 font-display font-bold text-xs tracking-widest uppercase cursor-pointer"
              >
                <FileText size={14} /> EXPORT CREATIVE CV <span className="font-mono text-[9px] text-emerald-400 font-normal ml-1">(PDF)</span>
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: PROFESSIONAL DETAILS BENTO / TABS */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* TAB BAR DESKTOP / MOBILE */}
          <div className="flex space-x-2 border-b border-zinc-900 pb-2">
            {[
              { id: "experience", label: "EXPERIENCE" },
              { id: "education", label: "EDUCATION" },
              { id: "skills", label: "SKILL METERS" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 font-display text-xs tracking-widest font-black transition-all relative ${
                  activeTab === tab.id 
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-emerald-450 to-cyan-400" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute bottom-[-9px] left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-12 min-h-[350px]"
            >
              {/* WORK EXPERIENCE TAB */}
              {activeTab === "experience" && (
                <div className="space-y-12">
                  {experiences.map((exp, idx) => {
                    return (
                      <div 
                        key={idx} 
                        className="group p-6 bg-zinc-950/25 border border-zinc-900 rounded-lg hover:border-zinc-800 hover:bg-zinc-950/35 transition-all duration-500 overflow-hidden cursor-default relative"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-[220px]">
                          {/* Main Work Info */}
                          <div className={`${exp.videoUrl ? "col-span-1 md:col-span-7 lg:col-span-7" : "col-span-1 md:col-span-12"} space-y-4`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-900/60">
                              <div className="flex items-center gap-4">
                                {exp.logo && (
                                  <div className="w-12 h-12 rounded-lg bg-zinc-950/80 border border-zinc-900 flex items-center justify-center p-2.5 shrink-0 group-hover:border-zinc-800 transition-all duration-300 overflow-hidden">
                                    <img 
                                      src={exp.logo} 
                                      alt={`${exp.company} Logo`} 
                                      className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-[1.2]" 
                                    />
                                  </div>
                                )}
                                <div>
                                  <h3 className="text-lg md:text-xl font-display font-bold text-white group-hover:translate-x-1 transition-transform duration-300">
                                    {exp.role}
                                  </h3>
                                  <p className="text-zinc-400 text-xs font-mono uppercase tracking-widest mt-1">
                                    {exp.company}
                                  </p>
                                </div>
                              </div>
                              <span className="font-mono text-xs text-zinc-500 whitespace-nowrap">
                                {exp.period}
                              </span>
                            </div>

                            <ul className="space-y-3">
                              {exp.bullets.map((bullet, bIdx) => (
                                <li key={bIdx} className="flex gap-3 items-start text-zinc-400 text-sm leading-relaxed">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>

                            {exp.projectId && onSelectProject && (
                              <div className="pt-2">
                                <button
                                  onClick={() => {
                                    const foundProject = PROJECTS.find(p => p.id === exp.projectId);
                                    if (foundProject) onSelectProject(foundProject);
                                  }}
                                  className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-emerald-400 hover:text-emerald-300 transition-all duration-300 uppercase py-2 px-4 border border-emerald-500/20 hover:border-emerald-500/40 rounded bg-emerald-500/5 hover:bg-emerald-500/10 cursor-pointer"
                                >
                                  View Project Details <ArrowUpRight size={14} className="text-emerald-400" />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Looping Mini Video Preview Box (Larger & Interactive Option 1) */}
                          {exp.videoUrl && (
                            <div className="col-span-1 md:col-span-5 lg:col-span-5 w-full pt-4 md:pt-0">
                              <div 
                                onClick={() => {
                                  if (exp.projectId && onSelectProject) {
                                    const foundProject = PROJECTS.find(p => p.id === exp.projectId);
                                    if (foundProject) onSelectProject(foundProject);
                                  }
                                }}
                                className="relative aspect-video w-full overflow-hidden rounded-lg border border-zinc-900 bg-black/80 shadow-[0_12px_42px_rgba(0,0,0,0.85)] hover:border-emerald-500/35 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(16,185,129,0.12)] transition-all duration-500 ease-out cursor-pointer group/vid-box"
                              >
                                <div className="w-full h-full relative overflow-hidden rounded">
                                  <iframe
                                    src={exp.videoUrl}
                                    title={`${exp.company} Work Loop`}
                                    className="w-[101%] h-[101%] pointer-events-none absolute -top-[0.5%] -left-[0.5%]"
                                    allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    style={{ border: 0 }}
                                  />
                                  
                                  {/* Absolute transparent click/pointer trap on top of the iframe */}
                                  <div className="absolute inset-0 z-10 bg-transparent cursor-pointer" />

                                  {/* Pulse loops indicator */}
                                  <div className="absolute bottom-3 left-3 bg-zinc-950/90 backdrop-blur-sm border border-zinc-900 px-2 py-0.5 rounded text-[8px] font-mono tracking-widest text-emerald-450 uppercase select-none flex items-center gap-1.5 shadow-md z-20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" /> Live Loop
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* EDUCATION TAB */}
              {activeTab === "education" && (
                <div className="space-y-8">
                  <div className="p-6 bg-zinc-950/25 border border-zinc-900 rounded-lg">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-emerald-400 shrink-0">
                        <GraduationCap size={20} />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-zinc-500 tracking-wider">2016 — 2021</span>
                        <h4 className="text-lg font-display font-medium text-white uppercase mt-1">
                          Universitas Negeri Jakarta
                        </h4>
                        <p className="text-sm font-semibold text-zinc-400 mt-1">
                          Bachelor Degree of Visual Art Education
                        </p>
                        <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                          Provided solid foundations in fine arts, design methodology, aesthetic concepts, and digital visualization tools, supporting a seamless shift into professional motion graphics.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-zinc-950/25 border border-zinc-900 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-emerald-400 shrink-0">
                        <GraduationCap size={20} />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-zinc-500 tracking-wider">2012 — 2015</span>
                        <h4 className="text-lg font-display font-medium text-white uppercase mt-1">
                          SMK Angkasa 1 Halim Perdana Kusumah
                        </h4>
                        <p className="text-sm text-zinc-400 mt-1">
                          Vocational High School Degree
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SKILLS METERS TAB */}
              {activeTab === "skills" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  {/* Left Column: Software Skill Meters */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-900/60 pb-2 mb-4">
                      SOFTWARE EXPERTISE
                    </h3>
                    {skillsList.map((skill, idx) => (
                      <div key={idx} className="space-y-2 p-4 bg-zinc-950/25 border border-zinc-900 rounded-lg">
                        <div className="flex justify-between items-baseline text-xs font-mono">
                          <span className="text-sm uppercase font-display font-medium text-zinc-300 tracking-wider">
                            {skill.name}
                          </span>
                          <div className="flex gap-2 items-center">
                            <span className="text-[10px] text-zinc-500 tracking-widest">{skill.level}</span>
                            <span className="text-white font-bold">{skill.percentage}%</span>
                          </div>
                        </div>
                        
                        {/* Interactive level bar with premium neon-gradient */}
                        <div className="w-full h-2.5 bg-zinc-950 border border-zinc-800/80 rounded-full overflow-hidden p-[1.5px]">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.percentage}%` }}
                            transition={{ duration: 1.2, delay: idx * 0.1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-8 p-4 bg-zinc-900/10 border border-dashed border-zinc-800/60 rounded-lg text-center">
                      <p className="text-xs font-mono text-zinc-500 uppercase tracking-wide">
                        PROFICIENT IN EDITING SUITES // AFTER EFFECTS // ADVANCED ROTOSCOPING // ADVANCED VFX
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Hard Skills */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-900/60 pb-2 mb-4">
                      HARD SKILLS
                    </h3>
                    <div className="space-y-4">
                      {[
                        "Broadcast Design",
                        "2D Character Rigging & Animation",
                        "High-Resolution Event LED Visuals",
                        "Compositing & VFX"
                      ].map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center p-4 bg-zinc-950/25 border border-zinc-900 rounded-lg hover:border-emerald-500/20 hover:bg-emerald-500/[0.01] transition-all duration-300 group">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] group-hover:scale-125 transition-transform duration-300" />
                          <span className="text-sm font-display font-medium text-zinc-300 group-hover:text-white transition-colors duration-300 uppercase tracking-wide">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <ExportCvModal isOpen={isExportCvModalOpen} onClose={() => setIsExportCvModalOpen(false)} />
    </section>
  );
}

function getEmbedUrl(url: string | undefined): string {
  if (!url) return "";
  if (url.includes("youtube.com/embed/")) {
    return url;
  }
  try {
    let videoId = "";
    let params = "";
    if (url.includes("youtu.be/")) {
      const parts = url.split("youtu.be/");
      const afterBe = parts[parts.length - 1];
      const queryIdx = afterBe.indexOf("?");
      if (queryIdx !== -1) {
        videoId = afterBe.substring(0, queryIdx);
        params = afterBe.substring(queryIdx + 1);
      } else {
        videoId = afterBe;
      }
    } else if (url.includes("youtube.com/watch")) {
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get("v") || "";
      const searchParams = new URLSearchParams(urlObj.search);
      searchParams.delete("v");
      params = searchParams.toString();
    } else if (url.includes("youtube.com/shorts/")) {
      const parts = url.split("youtube.com/shorts/");
      const afterShorts = parts[parts.length - 1];
      const queryIdx = afterShorts.indexOf("?");
      if (queryIdx !== -1) {
        videoId = afterShorts.substring(0, queryIdx);
        params = afterShorts.substring(queryIdx + 1);
      } else {
        videoId = afterShorts;
      }
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}${params ? `?${params}` : ""}`;
    }
  } catch (err) {
    console.warn("Error parsing video URL", err);
  }
  return url;
}

function ProjectModal({ project, onClose, onNext, onPrev }: { project: Project; onClose: () => void; onNext: () => void; onPrev: () => void; key?: any }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState(project.videoUrl);
  const [isModalHovered, setIsModalHovered] = useState(false);

  React.useEffect(() => {
    setActiveVideoUrl(project.videoUrl);
    setIsPlaying(false);
  }, [project]);

  const embedUrl = getEmbedUrl(activeVideoUrl);

  // Extract videoId safely from embedUrl
  let videoId = "";
  try {
    if (embedUrl && embedUrl.includes("/embed/")) {
      const parts = embedUrl.split("/embed/");
      const afterEmbed = parts[parts.length - 1];
      videoId = afterEmbed.split("?")[0];
    }
  } catch (err) {
    console.warn("Error parsing video ID in modal", err);
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12"
    >
      <div className="absolute inset-0 bg-[#06070f]/80 backdrop-blur-md" onClick={onClose} />
      
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="relative w-full max-w-6xl h-full lg:max-h-[85vh] overflow-y-auto bg-[#030612]/98 border-2 border-emerald-500/40 rounded-xl shadow-[0_0_50px_rgba(16,185,129,0.35)] shadow-[inset_0_0_20px_rgba(16,185,129,0.15)]"
      >
        {/* Hologram Corner Brackets */}
        <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-cyan-400 pointer-events-none z-30 shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
        <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-cyan-400 pointer-events-none z-30 shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
        <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-cyan-400 pointer-events-none z-30 shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
        <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-cyan-400 pointer-events-none z-30 shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
        <div className="absolute inset-1.5 border border-dashed border-emerald-500/10 rounded-lg pointer-events-none z-10" />

        <button onClick={onClose} className="absolute top-8 right-8 z-30 text-zinc-400 hover:text-white hover:scale-110 hover:shadow-[0_0_12px_rgba(34,211,238,0.6)] transition-all bg-[#0a1128]/80 border border-cyan-500/30 p-2.5 rounded-full backdrop-blur-sm">
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div 
            onMouseEnter={() => setIsModalHovered(true)}
            onMouseLeave={() => setIsModalHovered(false)}
            className="relative aspect-video lg:aspect-auto lg:h-[70vh] bg-[#02050b] border-b lg:border-b-0 lg:border-r border-zinc-900 overflow-hidden flex items-center justify-center group"
          >
            {/* Cyber/Holographic HUD grid cover */}
            <div 
              className="absolute inset-0 opacity-[0.14] pointer-events-none z-10" 
              style={{
                backgroundImage: "linear-gradient(rgba(16, 185, 129, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.25) 1px, transparent 1px)",
                backgroundSize: "20px 20px"
              }}
            />
            {/* Hologram sweep laser bar */}
            <div 
              className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none z-20 shadow-[0_0_12px_rgba(34,211,238,0.7)]"
              style={{
                animation: "hologram-sweep 6s linear infinite"
              }}
            />
            {embedUrl && isPlaying ? (
              <iframe
                src={`${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                {/* Autoplay / Loop muted preview on cursor hover (Always mounted to continue playing on hover re-entry) */}
                {videoId && (
                  <div 
                    className={`absolute inset-0 bg-black pointer-events-none select-none transition-opacity duration-500 ${isModalHovered ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  >
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&enablejsapi=1`}
                      className="w-full h-full border-none pointer-events-none scale-[1.03]"
                      title="Modal Hover Loop Frame"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                )}
                
                <img 
                  src={project.thumbnailUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover opacity-60 transition-transform duration-700"
                  style={{
                    transform: [
                      "mazda-excellence-2024",
                      "mandiri-golfcard-2025",
                      "mandiri-golfcard-2025-award",
                      "padi-umkm-empower",
                      "imigrasi-services",
                      "adab-sunnah-tpa",
                      "rcti-showreel",
                      "iodine-malnutrition-indonesia",
                      "wootag-intent-ai",
                      "pln-public-safety",
                      "speequal-profile",
                      "speequal-gaming-profile",
                      "star-corporate-profile",
                      "anggur-merah-launching"
                    ].includes(project.id)
                      ? (isModalHovered ? "scale(1.20)" : "scale(1.15)")
                      : (isModalHovered ? "scale(1.02)" : "scale(1.0)")
                  }}
                />
                
                {/* Trigger interactive overlay to play standard video with audio and controls */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/10 hover:bg-black/20 transition-colors duration-300">
                  <div 
                    onClick={() => setIsPlaying(true)}
                    className="w-20 h-20 rounded-full border border-white flex items-center justify-center cursor-pointer hover:bg-white hover:text-black transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] group animate-fade-in"
                  >
                    <Play size={24} fill="currentColor" className="translate-x-[2px]" />
                  </div>
                  {isModalHovered && (
                    <span className="absolute top-4 right-4 font-mono text-[8px] tracking-widest text-emerald-400 bg-black/95 px-2.5 py-1 rounded-full border border-emerald-500/20 backdrop-blur-sm shadow-md animate-pulse uppercase select-none pointer-events-none z-30">
                      Hovering Preview • Click to play with audio
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
          
          <div className="p-8 md:p-16 flex flex-col justify-between">
            <div>
              {/* Top Quick Navigation for seamless browsing */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-900/60">
                <button 
                  onClick={onPrev}
                  className="flex items-center gap-1 text-xs font-mono font-medium tracking-wider text-zinc-500 hover:text-zinc-300 hover:-translate-x-1.5 transition-all duration-300 uppercase"
                >
                  <ChevronLeft size={14} className="text-zinc-500 hover:text-zinc-300 pointer-events-none" /> Prev Project
                </button>
                <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest hidden sm:block">
                  Project Info
                </span>
                <button 
                  onClick={onNext}
                  className="flex items-center gap-1 text-xs font-mono font-medium tracking-wider text-emerald-400 hover:text-emerald-300 hover:translate-x-1.5 transition-all duration-300 uppercase"
                >
                  Next Project <ChevronRight size={14} className="text-emerald-400 pointer-events-none" />
                </button>
              </div>

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">{project.category}</span>
                  <span className="w-4 h-[1px] bg-zinc-800" />
                  <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">{project.date}</span>
                </div>
                {project.id === "mozy-app" && (
                  <div className="flex items-center gap-4 opacity-50 grayscale invert brightness-200">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/HK_Logo.png" alt="HK" className="h-6 w-auto" />
                    <div className="w-[1px] h-4 bg-white/20" />
                    <span className="font-display font-bold text-xs">MOZY</span>
                  </div>
                )}
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8 leading-[0.9]">{project.title}</h2>
              
              <p className="text-zinc-400 leading-relaxed mb-8">
                {project.description}
              </p>

              {/* Project Metadata Details */}
              {(project.role || (project.tools && project.tools.length > 0) || (project.deliverables && project.deliverables.length > 0)) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 border-t border-b border-zinc-900 py-6">
                  {project.role && (
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] tracking-widest text-zinc-550 uppercase block">Role</span>
                      <span className="text-zinc-200 text-sm font-medium">{project.role}</span>
                    </div>
                  )}
                  {project.tools && project.tools.length > 0 && (
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] tracking-widest text-zinc-550 uppercase block">Tools</span>
                      <span className="text-zinc-200 text-xs font-light">{project.tools.join(", ")}</span>
                    </div>
                  )}
                  {project.deliverables && project.deliverables.length > 0 && (
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] tracking-widest text-zinc-550 uppercase block">Deliverables</span>
                      <span className="text-zinc-200 text-xs font-light">{project.deliverables.join(", ")}</span>
                    </div>
                  )}
                </div>
              )}

              {project.episodes && project.episodes.length > 0 && (
                <div className="space-y-4 mb-8">
                  <h4 className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">Select Episode</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {project.episodes.map((ep, idx) => {
                      const isActive = activeVideoUrl === ep.videoUrl;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setActiveVideoUrl(ep.videoUrl);
                            setIsPlaying(true);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-md border text-xs font-mono transition-all duration-300 flex items-center gap-2 ${
                            isActive 
                              ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold" 
                              : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-400 animate-pulse" : "bg-zinc-800"}`} />
                          <span className="truncate">{ep.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {project.id === "main-showreel" && project.highlights && project.highlights.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">Key Highlights</h4>
                  <ul className="space-y-4">
                    {project.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-3 group">
                        <ChevronRight size={14} className="mt-1 text-zinc-700 group-hover:text-white transition-colors" />
                        <span className="text-sm text-zinc-300">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black p-6 pt-24"
        >
          <button onClick={onClose} className="absolute top-8 right-6">
            <X size={24} />
          </button>
          
          <div className="flex flex-col gap-8">
            <MobileNavLink href="#experience" onClick={onClose}>Profile</MobileNavLink>
            <MobileNavLink href="#work" onClick={onClose}>Work</MobileNavLink>
            <MobileNavLink href="#contact" onClick={onClose}>Contact</MobileNavLink>
          </div>
          
          <div className="mt-auto flex gap-6 pb-8">
             <SocialIcon icon={<Linkedin size={20} />} href="https://www.linkedin.com/in/sofa-fauzi-197606392/" />
             <SocialIcon icon={<Instagram size={20} />} href="https://www.instagram.com/so_sangart/?utm_source=ig_web_button_share_sheet" />
             <SocialIcon icon={<Youtube size={20} />} href="https://youtube.com/@nsofafauzi7676?si=oTZ0tsZV7J-SR6Yk" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <a 
      href={href} 
      onClick={onClick}
      className="text-6xl font-black tracking-tighter hover:text-zinc-500 transition-colors"
    >
      {children}
    </a>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <motion.a 
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      href={href} 
      target="_blank"
      rel="noopener noreferrer"
      className="p-3.5 border border-zinc-900 rounded-full text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-950/10 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all duration-300 backdrop-blur-sm"
    >
      {icon}
    </motion.a>
  );
}

function Footer() {
  return (
    <footer id="contact" className="relative px-6 md:px-12 py-16 md:py-24 border-t border-zinc-900/40 bg-transparent">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-[8vw] md:text-[5vw] font-black leading-[0.95] mb-8 text-white tracking-tighter uppercase">
          Ready to <span className="text-edge-glow">Animate</span> <br className="hidden sm:block" /> Your Ideas?
        </h2>
        
        <a 
          href="mailto:sofafauzi@gmail.com" 
          className="group relative flex items-center gap-4 text-2xl md:text-3xl lg:text-4xl font-display font-medium text-white hover:text-emerald-400 transition-colors duration-300"
        >
          sofafauzi@gmail.com
          <motion.div 
            whileHover={{ scale: 1.15, rotate: 5 }}
            className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-black p-4 rounded-full shadow-[0_4px_20px_rgba(52,211,153,0.25)] group-hover:shadow-[0_8px_30px_rgba(52,211,153,0.45)] transition-all duration-300"
          >
            <Mail size={24} />
          </motion.div>
        </a>

        {/* Social Icons Row */}
        <div className="flex items-center gap-5 mt-10">
          <SocialIcon icon={<Linkedin size={22} className="stroke-[1.8]" />} href="https://www.linkedin.com/in/sofa-fauzi-197606392/" />
          <SocialIcon icon={<Instagram size={22} className="stroke-[1.8]" />} href="https://www.instagram.com/so_sangart/?utm_source=ig_web_button_share_sheet" />
          <SocialIcon icon={<Youtube size={22} className="stroke-[1.8]" />} href="https://youtube.com/@nsofafauzi7676?si=oTZ0tsZV7J-SR6Yk" />
        </div>

        <div className="mt-16 md:mt-20 w-full flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-500 font-mono text-[10px] tracking-widest uppercase">
          <p>© 2026 NUR SOFA FAUZI. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <a href="https://www.linkedin.com/in/sofa-fauzi-197606392/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 hover:tracking-wider text-zinc-500 transition-all duration-300">LINKEDIN</a>
            <a href="https://www.instagram.com/so_sangart/?utm_source=ig_web_button_share_sheet" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 hover:tracking-wider text-zinc-500 transition-all duration-300">INSTAGRAM</a>
            <a href="https://youtube.com/@nsofafauzi7676?si=oTZ0tsZV7J-SR6Yk" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 hover:tracking-wider text-zinc-500 transition-all duration-300">YOUTUBE</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ShowreelSection({ onSelect }: { onSelect: (p: Project) => void }) {
  const showreelProject = PROJECTS.find(p => p.id === "main-showreel");
  
  if (!showreelProject) return null;

  return (
    <section id="showreel" className="relative px-6 md:px-12 py-16 md:py-20 bg-transparent border-t border-zinc-900/40 overflow-hidden">

      {/* Grid vertical line extensions */}
      <div className="absolute top-0 bottom-0 left-6 md:left-12 w-[1px] bg-zinc-900/40 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-6 md:right-12 w-[1px] bg-zinc-900/40 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Title */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-5">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-edge-glow uppercase">
              SHOWREEL
            </h2>
          </div>
          <div className="md:col-span-7 space-y-4 text-zinc-400 text-xs md:text-sm font-light leading-relaxed">
            <p>
              A curated look at some of my favorite work over the past years. This showreel highlights across various disciplines in the motion industry, featuring:
            </p>
            <ul className="space-y-3 mt-2 border-l border-zinc-800 pl-4">
              <li className="relative">
                <span className="absolute -left-[21px] top-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <p><strong className="text-white font-bold">Event Openers & Bumpers</strong> – Setting the tone for live and digital experiences.</p>
              </li>
              <li className="relative">
                <span className="absolute -left-[21px] top-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <p><strong className="text-white font-bold">Character Animation</strong> – Bringing personality and stories to life.</p>
              </li>
              <li className="relative">
                <span className="absolute -left-[21px] top-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <p><strong className="text-white font-bold">Visual Effects (VFX)</strong> – Enhancing reality through seamless digital integration.</p>
              </li>
              <li className="relative">
                <span className="absolute -left-[21px] top-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <p><strong className="text-white font-bold">Social Media Promos</strong> – Creating thumb-stopping, high-conversion marketing videos.</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Cinematic Video player frame with macOS-Style Browser Wrapper */}
        <div className="relative w-full rounded-xl bg-[#070913] border border-zinc-800/90 overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.95)] border-emerald-500/10 flex flex-col">
          {/* macOS Browser Header Mockup */}
          <div className="w-full h-10 sm:h-11 bg-[#161720] border-b border-zinc-950/50 px-3 sm:px-4 flex items-center justify-between select-none shrink-0 pointer-events-auto">
            {/* Left controls */}
            <div className="flex items-center gap-3.5 sm:gap-4">
              {/* Window control lights */}
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f]" />
              </div>
              
              {/* Sidebar toggle icon */}
              <div className="hidden sm:flex items-center gap-1 text-zinc-500/80">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M9 3v18" />
                </svg>
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 translate-y-[0.5px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>

              {/* Navigation Back & Forward glyphs */}
              <div className="hidden md:flex items-center gap-3 text-zinc-600 ml-1">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 cursor-not-allowed hover:text-zinc-500" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 cursor-not-allowed hover:text-zinc-500" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>

            {/* Centered browser search / url identifier bar */}
            <div className="flex-1 max-w-xs sm:max-w-md mx-3">
              <div className="w-full h-6 sm:h-7 bg-[#23242e]/80 border border-zinc-950/25 rounded-md flex items-center justify-start px-2 sm:px-3 text-zinc-500">
                <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
            </div>

            {/* Right toolbar controls */}
            <div className="flex items-center gap-3 sm:gap-4 text-zinc-500">
              {/* Share */}
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 cursor-pointer hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" x2="12" y1="2" y2="15" />
              </svg>

              {/* Plus */}
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 cursor-pointer hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" x2="12" y1="5" y2="19" />
                <line x1="5" x2="19" y1="12" y2="12" />
              </svg>

              {/* Tab Grid layers */}
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 cursor-pointer hover:text-[#06b6d4] transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="12" height="12" x="8" y="8" rx="1.5" />
                <path d="M4 12V6a2 2 0 0 1 2-2h6" />
              </svg>
            </div>
          </div>

          {/* Actual Video View Panel maintaining exact aspect ratio */}
          <div className="relative w-full aspect-video overflow-hidden">
            {/* Scanning Overlay lines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%),linear-gradient(90deg,rgba(16,185,129,0.01),rgba(0,0,0,0),rgba(6,182,212,0.01))] bg-[size:100%_4px,6px_100%] pointer-events-none z-10 opacity-70" />
            
            {/* Camera guidelines crosshair bracket overlays */}
            <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-emerald-500/25 group-hover:border-emerald-400/60 transition-colors duration-500 z-10" />
            <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-emerald-500/25 group-hover:border-emerald-400/60 transition-colors duration-500 z-10" />
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-emerald-500/25 group-hover:border-emerald-400/60 transition-colors duration-500 z-10" />
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-emerald-500/25 group-hover:border-emerald-400/60 transition-colors duration-500 z-10" />

            <div className="absolute bottom-8 right-16 z-10 bg-black/80 px-3 py-1.5 rounded-full border border-zinc-800/60 backdrop-blur-sm pointer-events-none font-mono text-[9px] tracking-widest text-emerald-400 hidden sm:block">
              {showreelProject.title.toUpperCase()} // LOOPS_ACTIVE
            </div>

            {/* Video Iframe Embed */}
            <div className="w-full h-full pointer-events-none scale-[1.01] origin-center select-none bg-zinc-950">
              <iframe
                src="https://www.youtube.com/embed/YkSDYaHYifk?autoplay=1&loop=1&playlist=YkSDYaHYifk&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&enablejsapi=1"
                className="w-full h-full"
                title="Showreel Continuous Loop"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                draggable="false"
              />
            </div>

            {/* Premium Interaction Overlay Trigger */}
            <div 
              onClick={() => onSelect(showreelProject)}
              className="absolute inset-0 bg-black/20 hover:bg-black/5 cursor-pointer transition-colors duration-500 z-10"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-4 right-4 md:top-8 md:right-8 px-2 py-1 md:px-4 md:py-2 rounded-full bg-black/90 border border-emerald-500/30 text-white font-display text-[7px] md:text-[9px] font-bold tracking-widest uppercase flex items-center gap-1 md:gap-2 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.1)] group-hover:border-emerald-400 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] transition-all duration-300 pointer-events-auto"
              >
                <span className="p-0.5 md:p-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full text-black flex items-center justify-center">
                  <Play size={6} fill="currentColor" className="translate-x-[0.5px] md:hidden" />
                  <Play size={8} fill="currentColor" className="translate-x-[0.5px] hidden md:block" />
                </span>
                Expand Full Experience
              </motion.div>
            </div>
          </div>
        </div>

        {/* Dynamic sliding marquee status ticker bar */}
        <div className="w-full overflow-hidden whitespace-nowrap py-4 border-t border-b border-zinc-900/60 font-mono text-[9px] text-zinc-500 flex select-none bg-zinc-950/20 backdrop-blur-[1px]">
          <div className="animate-marquee-left flex gap-16 shrink-0 pr-16 animate-infinite">
            <span>MOTION DESIGN SHOWREEL // CONTINUOUS LOOP ACTIVE // RESOLVED LINK: YKSDYAHYIFK</span>
            <span>CURATED WORKS // EVENT OPENERS // CHARACTER ANIMATION // VFX // SOCIAL MEDIA PROMOS</span>
            <span>HIGH-FIDELITY COMPOSITION // FULL-FRAME RENDER // REALTIME FEED ACCESSED // FPS: 60</span>
          </div>
          <div className="animate-marquee-left flex gap-16 shrink-0 pr-16 animate-infinite" aria-hidden="true">
            <span>MOTION DESIGN SHOWREEL // CONTINUOUS LOOP ACTIVE // RESOLVED LINK: YKSDYAHYIFK</span>
            <span>CURATED WORKS // EVENT OPENERS // CHARACTER ANIMATION // VFX // SOCIAL MEDIA PROMOS</span>
            <span>HIGH-FIDELITY COMPOSITION // FULL-FRAME RENDER // REALTIME FEED ACCESSED // FPS: 60</span>
          </div>
        </div>
      </div>
    </section>
  );
}

interface CinematicIntroProps {
  onStartLeaving: () => void;
  onFinished: () => void;
}

function CinematicIntro({ onStartLeaving, onFinished }: CinematicIntroProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startLeavingFlow = useRef(false);
  const handleExit = React.useCallback(() => {
    if (startLeavingFlow.current) return;
    startLeavingFlow.current = true;
    setIsLeaving(true);
    onStartLeaving();
    setTimeout(() => {
      onFinished();
    }, 1100);
  }, [onStartLeaving, onFinished]);

  // Safety bypass timeout - transition automatically after 9 seconds if video gets stuck or fails to play/end
  React.useEffect(() => {
    const backupTimeout = setTimeout(() => {
      handleExit();
    }, 9000);

    return () => clearTimeout(backupTimeout);
  }, [handleExit]);

  // Attempt to trigger play proactively with explicit muted setting for browser policy compliance
  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log("Auto-play was prevented or video file is missing. Graceful bypass enabled:", err);
        });
      }
    }
  }, []);

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center select-none text-zinc-100 transition-all duration-[1000ms] ease-out animate-none"
      style={{
        backgroundColor: "#080911",
        backgroundImage: `
          radial-gradient(circle at 15% 15%, rgba(16, 185, 129, 0.16) 0%, transparent 40%),
          radial-gradient(circle at 85% 30%, rgba(20, 184, 166, 0.15) 0%, transparent 40%),
          radial-gradient(circle at 50% 65%, rgba(139, 92, 246, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 20% 85%, rgba(244, 63, 94, 0.08) 0%, transparent 35%),
          radial-gradient(circle at 80% 90%, rgba(6, 182, 212, 0.14) 0%, transparent 45%)
        `,
        backgroundAttachment: "fixed",
        opacity: isLeaving ? 0 : 1,
        pointerEvents: isLeaving ? "none" : "auto",
        isolation: "auto"
      }}
    >
      {/* Dynamic backdrop grid */}
      <div 
        className={`absolute inset-0 bg-grid-cyber pointer-events-none transition-all duration-[1000ms] z-0 ${
          isLeaving ? "opacity-0 scale-105" : "opacity-[0.15] scale-100"
        }`} 
      />
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] aspect-square bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none transition-opacity duration-[1000ms] ${
          isLeaving ? "opacity-0" : "opacity-100"
        }`} 
      />

      {/* Cyber corners decoration for cinema display */}
      <div className={`absolute top-8 left-8 w-6 h-[1px] bg-emerald-500/30 transition-opacity duration-[1000ms] ${isLeaving ? "opacity-0" : "opacity-100"}`} />
      <div className={`absolute top-8 left-8 w-[1px] h-6 bg-emerald-500/30 transition-opacity duration-[1000ms] ${isLeaving ? "opacity-0" : "opacity-100"}`} />
      <div className={`absolute top-8 right-8 w-6 h-[1px] bg-emerald-500/30 transition-opacity duration-[1000ms] ${isLeaving ? "opacity-0" : "opacity-100"}`} />
      <div className={`absolute top-8 right-8 w-[1px] h-6 bg-emerald-500/30 transition-opacity duration-[1000ms] ${isLeaving ? "opacity-0" : "opacity-100"}`} />
      <div className={`absolute bottom-8 left-8 w-6 h-[1px] bg-emerald-500/30 transition-opacity duration-[1000ms] ${isLeaving ? "opacity-0" : "opacity-100"}`} />
      <div className={`absolute bottom-8 left-8 w-[1px] h-6 bg-emerald-500/30 transition-opacity duration-[1000ms] ${isLeaving ? "opacity-0" : "opacity-100"}`} />
      <div className={`absolute bottom-8 right-8 w-6 h-[1px] bg-emerald-500/30 transition-opacity duration-[1000ms] ${isLeaving ? "opacity-0" : "opacity-100"}`} />
      <div className={`absolute bottom-8 right-8 w-[1px] h-6 bg-emerald-500/30 transition-opacity duration-[1000ms] ${isLeaving ? "opacity-0" : "opacity-100"}`} />

      <div className={`absolute top-8 left-16 font-mono text-[9px] tracking-[0.2em] text-zinc-500 transition-opacity duration-[1000ms] ${isLeaving ? "opacity-0" : "opacity-100"}`}>
        NSF_STUDIO_INTRO // DETECTING STREAM_
      </div>

      {/* Main Video Center block - completely borderless for transparent atmospheric blending */}
      <div 
        className={`relative w-full max-w-[1330px] px-4 md:px-8 z-10 flex flex-col items-center justify-center transition-all duration-[1000ms] ease-out ${
          isLeaving ? "opacity-0 scale-[1.03] blur-sm" : "opacity-100 scale-[1.6] md:scale-[1.2]"
        }`}
        style={{ mixBlendMode: "screen" }}
      >
        <div className="relative w-full aspect-video overflow-hidden flex items-center justify-center group" style={{ mixBlendMode: "screen", backgroundColor: "transparent" }}>
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            controls={false}
            onCanPlay={() => setIsVideoLoaded(true)}
            onPlaying={() => setIsVideoLoaded(true)}
            onEnded={handleExit}
            onError={() => {
              console.warn("Video play error - source missing or unsupported codec. Graceful bypass.");
              handleExit();
            }}
            className={`w-full h-full object-contain transition-all duration-[1200ms] ${
              isVideoLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            style={{ 
              mixBlendMode: "screen",
              backgroundColor: "transparent",
              transform: "translate3d(0,0,0)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              filter: isVideoLoaded 
                ? "contrast(1.18) brightness(1.02)"
                : "none"
            }}
          >
            {/* Play imported reliable local MP4 file */}
            <source src={introVideo} type="video/mp4" />
            {/* Web-safe static path fallback names */}
            <source src="/LOGO OPENING NUR SOFA FAUZI.mp4" type="video/mp4" />
            <source src="LOGO OPENING NUR SOFA FAUZI.mp4" type="video/mp4" />
          </video>

          {/* Minimal buffering overlay until metadata or frames load without solid backdrop */}
          {!isVideoLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-transparent z-10">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-emerald-500/10 border-t-emerald-400 animate-spin" />
                <div className="w-8 h-8 rounded-full border border-dashed border-cyan-500/10 animate-spin" style={{ animationDirection: "reverse" }} />
              </div>
              <div className="text-center font-mono">
                <p className="text-[9px] tracking-[0.3em] text-emerald-400 font-bold uppercase animate-pulse">NSF CREATIVE</p>
                <p className="text-[7.5px] tracking-[0.15em] text-zinc-500 uppercase mt-1">STREAMING OPENING REEL...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Direct Skip To Portfolio Trigger with glass blur */}
      <button
        onClick={handleExit}
        className={`absolute bottom-16 px-8 py-3 rounded-full border border-zinc-800/40 bg-zinc-950/20 backdrop-blur-md hover:bg-zinc-900/40 hover:border-zinc-700 text-zinc-400 hover:text-white font-mono text-[9px] tracking-[0.3em] transition-all uppercase z-[210] cursor-pointer transition-all duration-[800ms] ${
          isLeaving ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
        }`}
      >
        [ Skip Intro // Masuk Ke Portfolio ]
      </button>

      {/* Bottom telemetry indicators */}
      <div className={`absolute bottom-8 left-16 right-16 flex justify-between items-center font-mono text-[8px] text-zinc-600 tracking-widest transition-opacity duration-[1000ms] ${isLeaving ? "opacity-0" : "opacity-100"}`}>
        <span>STABLE PIPELINE ACCESSED // 60 FPS</span>
        <span className="flex items-center gap-1.5 animate-pulse text-emerald-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_currentColor]" />
          ACTIVE STREAM
        </span>
      </div>
    </div>
  );
}


