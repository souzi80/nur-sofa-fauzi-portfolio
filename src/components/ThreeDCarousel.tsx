import { motion, AnimatePresence } from "motion/react";
import React, { useState, useRef, useEffect } from "react";
import { Project } from "../constants";
import { ArrowUpRight } from "lucide-react";

interface ThreeDCarouselProps {
  projects: Project[];
  onSelect: (p: Project) => void;
  activeIndex: number;
  setActiveIndex: (idx: number) => void;
}

export function ThreeDCarousel({ projects, onSelect, activeIndex, setActiveIndex }: ThreeDCarouselProps) {
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isContainerHovered, setIsContainerHovered] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const isDraggingActiveRef = useRef(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Autoplay auto-scrolling effect every 4 seconds unless hovered or dragging
  useEffect(() => {
    if (projects.length <= 1) return;
    
    const interval = setInterval(() => {
      if (!isContainerHovered && !isDragging) {
        setActiveIndex((activeIndex + 1) % projects.length);
      }
    }, 4200); // 4.2 seconds is right in the 3-5 seconds sweet spot

    return () => clearInterval(interval);
  }, [activeIndex, projects.length, isContainerHovered, isDragging, setActiveIndex]);

  const getCardWidthAndSpread = () => {
    if (windowWidth < 640) {
      // Mobile (reduced by 30% from 360/170 to 252/119)
      return { cardWidth: 252, spread: 119 };
    } else if (windowWidth < 1024) {
      // Tablet (+30% from 380/210 -> 490/270)
      return { cardWidth: 490, spread: 270 };
    } else {
      // Desktop (+30% from 460/290 -> 600/380)
      return { cardWidth: 600, spread: 380 };
    }
  };

  const { cardWidth, spread } = getCardWidthAndSpread();

  // Circular offset helper to find shortest path on a wrapping loop
  const getCircularOffset = (idx: number, progressVal: number, total: number) => {
    let diff = idx - progressVal;
    const half = total / 2;
    while (diff > half) diff -= total;
    while (diff <= -half) diff += total;
    return diff;
  };

  // Continuous loop dragging, no rubberbanding needed
  const progress = activeIndex - (dragOffset / spread);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    
    // Check if clicking inside interactive buttons or if it's the iframe/etc.
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("iframe") || target.closest("a")) return;

    isPointerDownRef.current = true;
    isDraggingActiveRef.current = false;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    setDragOffset(0);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    
    const deltaX = e.clientX - startXRef.current;
    const deltaY = e.clientY - startYRef.current;

    // Check if we have initiated a true drag (exceeded 6px)
    if (!isDraggingActiveRef.current) {
      if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          isDraggingActiveRef.current = true;
          setIsDragging(true);
          try {
            containerRef.current?.setPointerCapture(e.pointerId);
          } catch (err) {
            console.warn("Failed to set pointer capture", err);
          }
        } else {
          isPointerDownRef.current = false;
          return;
        }
      }
    }

    if (isDraggingActiveRef.current) {
      setDragOffset(deltaX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    
    isPointerDownRef.current = false;
    
    if (isDraggingActiveRef.current) {
      isDraggingActiveRef.current = false;
      setIsDragging(false);
      try {
        containerRef.current?.releasePointerCapture(e.pointerId);
      } catch (err) {}

      const threshold = 60; // minimum drag distance threshold to initiate a transition
      if (Math.abs(dragOffset) >= threshold) {
        const dragRatio = dragOffset / spread;
        let change = 0;
        if (dragOffset > 0) {
          // Dragged to the right -> view previous items
          change = -Math.max(1, Math.round(dragRatio));
        } else {
          // Dragged to the left -> view next items
          change = -Math.min(-1, Math.round(dragRatio));
        }
        
        const targetIndex = (activeIndex + change + projects.length) % projects.length;
        setActiveIndex(targetIndex);
      }
    }
    
    setDragOffset(0);
  };

  return (
    <div 
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => setIsContainerHovered(true)}
      onMouseLeave={() => setIsContainerHovered(false)}
      className={`relative w-full pt-3 pb-8 md:pt-4 md:pb-12 flex flex-col items-center justify-center overflow-visible select-none touch-pan-y ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{ perspective: "1500px" }}
    >
      {/* 3D Container Track */}
      <div 
        className="relative flex items-center justify-center w-full h-[220px] md:h-[400px] lg:h-[460px]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {projects.map((project, idx) => {
          const offset = getCircularOffset(idx, progress, projects.length);
          const isActive = idx === activeIndex;

          const xTranslation = offset * spread;
          const zTranslation = -Math.abs(offset) * 160;
          const rotationY = Math.max(-35, Math.min(35, -offset * 32));
          
          const cardScale = Math.max(0.75, 1 - Math.abs(offset) * 0.12);
          
          // Smoothly fade far background cards to 0 before they snap/wrap symmetrically at the back
          const absOffset = Math.abs(offset);
          let cardOpacity = 0;
          if (projects.length <= 3) {
            cardOpacity = Math.max(0.35, 1 - absOffset * 0.4);
          } else {
            if (absOffset < 1.5) {
              cardOpacity = 1 - absOffset * 0.4;
            } else if (absOffset < 2.2) {
              cardOpacity = 0.4 * (1 - (absOffset - 1.5) / 0.7);
            } else {
              cardOpacity = 0;
            }
          }

          const zIndex = Math.round(100 - Math.abs(offset) * 20);

          const cardShadow = isActive 
            ? "0 20px 40px -12px rgba(16, 185, 129, 0.12)"
            : "0 8px 24px -3px rgba(0, 0, 0, 0.06)";

          return (
            <ThreeDCarouselCard
              key={project.id}
              project={project}
              isActive={isActive}
              xTranslation={xTranslation}
              zTranslation={zTranslation}
              rotationY={rotationY}
              cardScale={cardScale}
              cardOpacity={cardOpacity}
              cardShadow={cardShadow}
              cardWidth={cardWidth}
              zIndex={zIndex}
              onCardClick={() => {
                if (isActive) {
                  onSelect(project);
                } else {
                  setActiveIndex(idx);
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

interface CardProps {
  key?: string | number;
  project: Project;
  isActive: boolean;
  xTranslation: number;
  zTranslation: number;
  rotationY: number;
  cardScale: number;
  cardOpacity: number;
  cardShadow: string;
  cardWidth: number;
  zIndex: number;
  onCardClick: () => void;
}

function ThreeDCarouselCard({
  project,
  isActive,
  xTranslation,
  zTranslation,
  rotationY,
  cardScale,
  cardOpacity,
  cardShadow,
  cardWidth,
  zIndex,
  onCardClick,
}: CardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const pointerDownPosRef = useRef<{ x: number; y: number } | null>(null);

  const handleMouseEnter = () => {
    if (!isActive) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    if (!isActive) {
      setIsHovered(false);
    }
  }, [isActive]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!pointerDownPosRef.current) return;
    const diffX = Math.abs(e.clientX - pointerDownPosRef.current.x);
    const diffY = Math.abs(e.clientY - pointerDownPosRef.current.y);
    pointerDownPosRef.current = null;

    if (diffX < 6 && diffY < 6) {
      onCardClick();
    }
  };

  const isCroppedProject = [
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
  ].includes(project.id);

  return (
    <motion.div
      animate={{
        x: xTranslation,
        scale: cardScale,
        opacity: cardOpacity,
        rotateY: rotationY,
        z: zTranslation,
      }}
      transition={{
        type: "spring",
        stiffness: 180,
        damping: 22,
        mass: 0.9,
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="absolute select-none overflow-hidden rounded-xl border bg-[#050914] transition-colors duration-300"
      style={{
        width: `${cardWidth}px`,
        aspectRatio: "16 / 9",
        boxShadow: isActive 
          ? "0 0 25px rgba(16, 185, 129, 0.25), inset 0 0 15px rgba(16, 185, 129, 0.2)"
          : cardShadow,
        zIndex: zIndex,
        borderColor: isActive && isHovered 
          ? "rgba(34, 211, 238, 0.7)" 
          : isActive 
          ? "rgba(16, 185, 129, 0.55)" 
          : "rgba(16, 185, 129, 0.2)",
        transformStyle: "preserve-3d",
        cursor: isActive ? "pointer" : "zoom-in",
      }}
    >
      <style>{`
        @keyframes hologram-sweep {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>

      {/* Cyber/Holographic HUD grid matrix background (very light) */}
      <div 
        className="absolute inset-0 opacity-[0.14] pointer-events-none z-10" 
        style={{
          backgroundImage: "linear-gradient(rgba(16, 185, 129, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.2) 1px, transparent 1px)",
          backgroundSize: "16px 16px"
        }}
      />

      {/* Laser Sweep Bar */}
      <div 
        className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none z-20 shadow-[0_0_10px_rgba(34,211,238,0.7)]"
        style={{
          animation: "hologram-sweep 5s linear infinite"
        }}
      />

      {/* Futuristic Corner Brackets */}
      <div className={`absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 ${isActive ? 'border-cyan-400/80 shadow-[0_0_8px_rgba(34,211,238,0.4)]' : 'border-emerald-500/40'} pointer-events-none z-20 transition-all duration-300`} />
      <div className={`absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 ${isActive ? 'border-cyan-400/80 shadow-[0_0_8px_rgba(34,211,238,0.4)]' : 'border-emerald-500/40'} pointer-events-none z-20 transition-all duration-300`} />
      <div className={`absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 ${isActive ? 'border-cyan-400/80 shadow-[0_0_8px_rgba(34,211,238,0.4)]' : 'border-emerald-500/40'} pointer-events-none z-20 transition-all duration-300`} />
      <div className={`absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 ${isActive ? 'border-cyan-400/80 shadow-[0_0_8px_rgba(34,211,238,0.4)]' : 'border-emerald-500/40'} pointer-events-none z-20 transition-all duration-300`} />

      {/* Inner double border outline */}
      <div className={`absolute inset-1.5 border border-dashed rounded-lg pointer-events-none transition-all duration-500 z-10 ${
        isActive ? 'border-emerald-500/25' : 'border-zinc-800/10'
      }`} />

      {/* Static HUD readings */}
      <div className="absolute top-3 left-9 font-mono text-[6px] tracking-widest text-emerald-400/70 pointer-events-none z-20 select-none uppercase">
        SYS_LNK: 0x8F9A
      </div>
      
      <div className="absolute top-3 right-9 font-mono text-[6px] tracking-widest text-emerald-400/70 pointer-events-none z-20 select-none uppercase">
        HOLO_PRJ_ON
      </div>

      {/* Static Thumbnail Layer */}
      <img
        src={project.thumbnailUrl}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 pointer-events-none"
        style={{
          transform: isActive && isHovered 
            ? `scale(${isCroppedProject ? 1.20 : 1.04})` 
            : `scale(${isCroppedProject ? 1.15 : 1.0})`,
        }}
        draggable="false"
      />

      {/* Modern Vignette Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent opacity-90 pointer-events-none z-0" />

      {/* Hover Action Trigger (Arrow Icon) */}
      {isActive && (
        <div className="absolute top-4 right-4 overflow-hidden z-20 pointer-events-none">
          <div className={`bg-gradient-to-r from-emerald-400 to-cyan-400 text-black p-2.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all duration-300 ${
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}>
            <ArrowUpRight size={14} />
          </div>
        </div>
      )}

      {/* Tag/Badge for Playlists */}
      {project.episodes && (
        <div className="absolute top-4 left-4 z-10 font-mono text-[8px] font-bold tracking-widest bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded text-emerald-300">
          PLAYLIST
        </div>
      )}

      {/* Overlay Typography Details */}
      <div className="absolute bottom-5 left-5 right-5 pointer-events-none z-20">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-4 h-[1px] bg-emerald-500/50" />
          <span className="text-[8px] font-mono tracking-[0.15em] uppercase text-emerald-400">{project.date}</span>
        </div>
        <h4 className="text-base md:text-lg font-display font-bold leading-tight text-white group-hover:text-emerald-300 transition-colors duration-300">
          {project.title}
        </h4>
      </div>
    </motion.div>
  );
}
