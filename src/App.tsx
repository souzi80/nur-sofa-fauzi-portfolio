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

function HeroSection({ isPlayingIntro, isIntroLeaving }: { isPlayingIntro: boolean; isIntroLeaving: boolean }) {
  const isHidden = isPlayingIntro && !isIntroLeaving;
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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
    <section ref={containerRef} className="relative min-h-[100svh] lg:h-screen flex items-center pt-28 pb-12 lg:py-0 px-6 md:px-12 overflow-hidden">
      {/* Viewport/Camera Brackets and Crosshairs with entry animations */}
      <motion.div
        animate={{ opacity: isHidden ? 0 : 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-28 left-6 md:left-12 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
          <span className="text-emerald-500 font-mono text-sm select-none font-black animate-pulse">+</span>
          <span className="absolute left-4 font-mono text-[8px] text-zinc-500 uppercase tracking-widest hidden sm:inline whitespace-nowrap">CAM_A // VIEWPOINT</span>
        </div>
        <div className="absolute top-28 right-6 md:right-12 translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
          <span className="text-emerald-500 font-mono text-sm select-none font-black animate-pulse">+</span>
          <span className="absolute right-4 font-mono text-[8px] text-zinc-500 uppercase tracking-widest hidden sm:inline whitespace-nowrap">REC_RE // SL_01</span>
        </div>
        <div className="absolute bottom-16 left-6 md:left-12 -translate-x-1/2 translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
          <span className="text-emerald-500 font-mono text-sm select-none font-black">+</span>
        </div>
        <div className="absolute bottom-16 right-6 md:right-12 translate-x-1/2 translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
          <span className="text-emerald-500 font-mono text-sm select-none font-black">+</span>
        </div>

        {/* Spinning technical motion vector aperture */}
        <div className="absolute right-[8%] top-[12%] w-[320px] md:w-[480px] aspect-square pointer-events-none opacity-[0.14] animate-spin duration-[40000ms] ease-linear">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-zinc-700 w-full h-full">
            <circle cx="50" cy="50" r="46" strokeDasharray="2,2" />
            <circle cx="50" cy="50" r="38" />
            <circle cx="50" cy="50" r="24" strokeDasharray="1,1" />
            <path d="M 50 4 L 50 96 M 4 50 L 96 50" strokeDasharray="1,2" />
            <polygon points="50,15 54,25 65,25 57,32 61,42 50,35 39,42 43,32 35,25 46,25" strokeDasharray="0.5,0.5" />
            <path d="M 50 4 A 46 45 0 0 1 96 50" strokeWidth="0.8" className="stroke-emerald-500" />
            <path d="M 50 96 A 46 45 0 0 1 4 50" strokeWidth="0.8" className="stroke-cyan-500" />
          </svg>
        </div>

        {/* Live active coordinate node */}
        <div className="absolute left-8 md:on-left top-1/2 -translate-y-1/2 -rotate-90 origin-left z-20 font-mono text-[8px] text-zinc-500 tracking-[0.3em] uppercase hidden xl:flex items-center gap-3">
          <span className="w-2 h-[1px] bg-emerald-500" />
          SYS-GRID // COORD_X: 192.168.1.30 // ACTIVE_RENDERING
        </div>
      </motion.div>

      <motion.div style={{ y, opacity: scrollOpacity }} className="relative z-10 w-full">
        <motion.div
          animate={{ opacity: isHidden ? 0 : 1, y: isHidden ? 30 : 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={isHidden ? { opacity: 0 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 font-mono text-xs tracking-widest text-emerald-400 font-bold uppercase flex items-center gap-2"
          >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Creative Motion Designer & 2D Animator
        </motion.div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 w-full">
          <div className="flex flex-col justify-start select-none">
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-[12vw] md:text-[10vw] font-display font-black leading-[0.85] tracking-tighter text-white"
            >
              MOTION
            </motion.h1>
            
            {/* Kinetic rotating row */}
            <div 
              style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
              className="relative overflow-visible h-[1.35em] md:h-[1.10em] text-[12vw] md:text-[10vw] font-display font-black leading-[0.85] tracking-tighter text-white min-w-[300px] sm:min-w-[420px] md:min-w-[550px] lg:min-w-[600px]"
            >
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={kineticIndex}
                  initial={{ rotateX: 90, opacity: 0, scale: 0.95 }}
                  animate={{ rotateX: 0, opacity: 1, scale: 1 }}
                  exit={{ rotateX: -90, opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="text-edge-glow absolute left-0 top-0 whitespace-nowrap inline-block"
                >
                  {kineticWords[kineticIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Glowing NSF Design Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="relative flex items-center justify-center lg:justify-end shrink-0 xl:mr-16"
          >
            {/* Spinning background outline ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[247px] h-[247px] md:w-[325px] md:h-[325px] rounded-full border border-dashed border-emerald-500/20 animate-spin duration-[30000ms]" />
            </div>
            
            {!logoErrorAll ? (
              <img 
                src={logoPaths[currentLogoIndex]} 
                alt="NSF Design Logo" 
                onError={handleLogoError}
                referrerPolicy="no-referrer"
                className="w-[234px] h-[234px] md:w-[312px] md:h-[312px] object-contain select-none pointer-events-none transition-all duration-300"
                style={{
                  filter: "brightness(0) invert(1) drop-shadow(0 0 5px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 15px rgba(16, 185, 129, 0.5))"
                }}
              />
            ) : (
              <svg viewBox="0 0 300 300" className="w-[234px] h-[234px] md:w-[312px] md:h-[312px] drop-shadow-[0_0_24px_rgba(16,185,129,0.2)]" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logoGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" /> {/* Luminous Emerald */}
                    <stop offset="50%" stopColor="#14b8a6" /> {/* Radiant Teal */}
                    <stop offset="100%" stopColor="#06b6d4" /> {/* Bright Cyan */}
                  </linearGradient>
                  <filter id="logoSubtleBloom" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Logo Circle Outline with Gradient and Subtle Glow */}
                <circle 
                  cx="150" 
                  cy="140" 
                  r="84" 
                  stroke="#ffffff" 
                  strokeWidth="2.5" 
                  fill="none" 
                  style={{ filter: "drop-shadow(0 0 2px rgba(255,255,255,0.6)) drop-shadow(0 0 6px rgba(16,185,129,0.4))" }}
                  className="opacity-90"
                />
                <circle 
                  cx="150" 
                  cy="140" 
                  r="84" 
                  stroke="url(#logoGlowGrad)" 
                  strokeWidth="1.2" 
                  fill="none" 
                  className="opacity-60"
                />

                {/* Logo Letters "NSF" */}
                {/* N with crisp geometric corners */}
                <path 
                  d="M 68 185 L 68 85 L 118 185 L 118 85" 
                  stroke="#ffffff" 
                  strokeWidth="18" 
                  strokeLinecap="square" 
                  strokeLinejoin="miter"
                  fill="none" 
                  style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,0.8)) drop-shadow(0 0 8px rgba(16,185,129,0.5))" }}
                />

                {/* S curve following the patented design */}
                <path 
                  d="M 172 105 C 172 87, 126 87, 126 116 C 126 142, 172 136, 172 159 C 172 187, 122 187, 122 170" 
                  stroke="#ffffff" 
                  strokeWidth="18" 
                  strokeLinecap="square" 
                  strokeLinejoin="round"
                  fill="none" 
                  style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,0.8)) drop-shadow(0 0 8px rgba(16,185,129,0.5))" }}
                />
                {/* Patented parallel line details in the S curve */}
                <path 
                  d="M 124 113 L 144 113 M 124 119 L 144 119" 
                  stroke="url(#logoGlowGrad)" 
                  strokeWidth="2.5" 
                  strokeLinecap="square"
                />
                <path 
                  d="M 152 153 L 172 153 M 152 159 L 172 159" 
                  stroke="url(#logoGlowGrad)" 
                  strokeWidth="2.5" 
                  strokeLinecap="square"
                />

                {/* F with bold geometric flat-caps */}
                <path 
                  d="M 198 185 L 198 85 L 242 85 M 198 131 L 228 131" 
                  stroke="#ffffff" 
                  strokeWidth="18" 
                  strokeLinecap="square" 
                  strokeLinejoin="miter"
                  fill="none" 
                  style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,0.8)) drop-shadow(0 0 8px rgba(16,185,129,0.5))" }}
                />

                {/* Text "Design" */}
                <text 
                  x="150" 
                  y="245" 
                  textAnchor="middle" 
                  fill="#ffffff" 
                  className="font-sans font-bold text-[20px] tracking-[0.45em] uppercase"
                  style={{ 
                    letterSpacing: '0.45em', 
                    fontFamily: 'system-ui, sans-serif',
                    filter: "drop-shadow(0 0 3px rgba(255,255,255,0.8)) drop-shadow(0 0 8px rgba(16,185,129,0.5))"
                  }}
                >
                  D e s i g n
                </text>
              </svg>
            )}
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <p className="max-w-md text-zinc-400 font-light leading-relaxed">
            Specializing in dynamic visual storytelling, 2D animation, and high-impact event bumpers for industry leaders.
          </p>
          
          <div className="flex gap-6">
             <SocialIcon icon={<Linkedin size={18} />} href="https://www.linkedin.com/in/sofa-fauzi-197606392/" />
             <SocialIcon icon={<Instagram size={18} />} href="https://www.instagram.com/so_sangart/?utm_source=ig_web_button_share_sheet" />
             <SocialIcon icon={<Youtube size={18} />} href="https://youtube.com/@nsofafauzi7676?si=oTZ0tsZV7J-SR6Yk" />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>

      {/* Decorative background element — Dual ambient light-mesh glow */}
      <div className="absolute top-1/3 right-[-10%] w-[55%] aspect-square rounded-full bg-emerald-500/12 blur-[130px] -z-10 animate-pulse duration-[12000ms]" />
      <div className="absolute bottom-1/4 left-[-10%] w-[40%] aspect-square rounded-full bg-cyan-500/10 blur-[125px] -z-10 animate-pulse duration-[10000ms]" />
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
              className="isolate space-y-4 md:space-y-6 relative p-6 md:p-10 rounded-3xl border border-zinc-900/60 bg-zinc-950/25 overflow-hidden transition-all duration-300 shadow-xl"
            >
              {/* Dynamic 10% blurred background corresponding to active category project */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 rounded-3xl select-none">
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

                {/* Slider Control Buttons */}
                <div className="flex items-center gap-2 self-end">
                  <button 
                    onClick={() => handlePrev(cat.id, cat.projects.length)}
                    className="p-3 border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-400 hover:text-emerald-400 rounded-full shadow-md transition-all focus:outline-none"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={() => handleNext(cat.id, cat.projects.length)}
                    className="p-3 border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-400 hover:text-emerald-400 rounded-full shadow-md transition-all focus:outline-none"
                    aria-label="Scroll right"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* 3D Carousel container */}
              <div className="z-10 relative">
                <ThreeDCarousel
                  projects={cat.projects}
                  onSelect={onSelect}
                  activeIndex={currentActive}
                  setActiveIndex={(idx) => setActiveCategoryIndexes(prev => ({ ...prev, [cat.id]: idx }))}
                />
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
        className="relative w-full max-w-6xl h-full overflow-y-auto bg-[#0c0e1a]/95 border border-zinc-800/80 rounded-lg"
      >
        <button onClick={onClose} className="absolute top-8 right-8 z-30 text-zinc-500 hover:text-white transition-colors bg-black/50 p-2 rounded-full">
          <X size={24} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div 
            onMouseEnter={() => setIsModalHovered(true)}
            onMouseLeave={() => setIsModalHovered(false)}
            className="relative aspect-video lg:aspect-auto lg:h-[70vh] bg-zinc-950 border-b lg:border-b-0 lg:border-r border-zinc-900 overflow-hidden flex items-center justify-center group"
          >
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
    <a 
      href={href} 
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 border border-zinc-900 rounded-full text-zinc-500 hover:text-white hover:border-zinc-500 hover:bg-zinc-950 transition-all"
    >
      {icon}
    </a>
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
          className="group relative flex items-center gap-4 text-2xl md:text-4xl font-display font-medium text-white hover:text-emerald-450 transition-colors duration-300"
        >
          sofafauzi@gmail.com
          <motion.div 
            whileHover={{ scale: 1.15, rotate: 5 }}
            className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-black p-4 rounded-full shadow-[0_4px_20px_rgba(52,211,153,0.25)] group-hover:shadow-[0_8px_30px_rgba(52,211,153,0.45)] transition-all duration-300"
          >
            <Mail size={24} />
          </motion.div>
        </a>

        <div className="mt-16 md:mt-20 w-full flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-500 font-mono text-[10px] tracking-widest uppercase">
          <p>© 2026 NUR SOFA FAUZI. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-emerald-400 hover:tracking-wider text-zinc-500 transition-all duration-300">DRIBBBLE</a>
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
    <section className="relative px-6 md:px-12 py-16 md:py-20 bg-transparent border-t border-zinc-900/40 overflow-hidden">

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

        {/* Cinematic Video player frame */}
        <div className="relative w-full aspect-video rounded-xl bg-zinc-950 border border-zinc-900 overflow-hidden group shadow-[0_0_50px_rgba(0,0,0,0.9)]">
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


