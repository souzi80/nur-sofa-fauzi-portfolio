export interface Episode {
  title: string;
  videoUrl: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  videoUrl?: string;
  logoUrl?: string;
  thumbnailUrl: string;
  highlights: string[];
  episodes?: Episode[];
  role?: string;
  tools?: string[];
  deliverables?: string[];
}

export const PROJECTS: Project[] = [
  {
    id: "mozy-app",
    title: "Mozy App by HK",
    category: "Bumper Event",
    date: "April 2026",
    description: "Conceptualized and produced high-impact video bumpers for the official Mozy App launch event by HK. Created distinct visual assets including opening sequence, launch transitions, and speaker introduction bumpers.",
    thumbnailUrl: "https://img.youtube.com/vi/xWn-pXxvo5c/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/xWn-pXxvo5c",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e4/HK_Logo.png",
    role: "Motion Graphic Designer",
    tools: ["Adobe After Effects", "Premiere Pro", "Illustrator", "Photoshop", "Capcut"],
    deliverables: ["Ultra-wide LED Screen Visuals", "Event Bumpers", "Looping Backgrounds", "Speaker Title Animations"],
    highlights: [
      "Conceptualized & produced high-impact video bumpers",
      "Opening sequence creation",
      "Speaker introduction bumpers"
    ]
  },
  {
    id: "star-corporate-profile",
    title: "Company Profile STAR 2026",
    category: "Other Project",
    date: "April 2026",
    description: "A highly innovative, futuristic video profiling STAR in 2026. Highlights their progressive vision, operational breakthroughs, and digital transformative systems using crisp vectors and rich motion choreography.",
    thumbnailUrl: "https://img.youtube.com/vi/eWc2rRhgGzE/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/eWc2rRhgGzE",
    role: "Director of Motion Graphics",
    tools: ["Adobe After Effects", "Premiere Pro", "Illustrator"],
    deliverables: ["Vision Explainer Film", "Stylized Tech Overlays", "Minimalist Vector Assets"],
    highlights: [
      "Cutting-edge camera transition choreography",
      "Pristine, balanced grid layouts using Inter typography",
      "Smooth modern morphing shapes mapping high business values"
    ]
  },
  {
    id: "main-showreel",
    title: "SHOWREEL",
    category: "Other Project",
    date: "March 2026",
    description: "A curated look at some of my favorite work over the past years. This showreel highlights across various disciplines in the motion industry, featuring event openers & bumpers, character animation, visual effects, and social media promos.",
    thumbnailUrl: "https://img.youtube.com/vi/YkSDYaHYifk/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/YkSDYaHYifk",
    highlights: [
      "Event Openers & Bumpers – Setting the tone for live and digital experiences.",
      "Character Animation – Bringing personality and stories to life.",
      "Visual Effects (VFX) – Enhancing reality through seamless digital integration.",
      "Social Media Promos – Creating thumb-stopping, high-conversion marketing videos."
    ]
  },
  {
    id: "rcti-showreel",
    title: "RCTI+ Promotion SHOWREEL",
    category: "Other Project",
    date: "March 2026",
    description: "High-impact motion graphics and digital campaign assets developed for RCTI+ Superapp. Executed with broadcast-level precision to engage wide audiences across social media and digital streaming platforms.",
    thumbnailUrl: "https://img.youtube.com/vi/YnU4a_GdGTA/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/YnU4a_GdGTA",
    role: "Motion Graphic Designer",
    tools: ["Adobe After Effects", "Premiere Pro", "Illustrator", "Photoshop", "Capcut"],
    deliverables: ["Social Media Assets", "Digital Broadcast Promos", "UI/UX Motion Elements"],
    highlights: [
      "Developed high-fidelity motion graphics to support promotional program needs for the RCTI+ application across various promotional channels.",
      "Optimized content for social media and diverse digital broadcast promotional structures."
    ]
  },
  {
    id: "crystalin-product-launch",
    title: "OT - Launching Product \"CRYSTALIN\" Event Bumper",
    category: "Bumper Event",
    date: "March 2026",
    description: "Designed a collection of modern event video bumpers for the grand product launch of \"CRYSTALIN\" by Orang Tua (OT) Group. This production encompasses high-aesthetic opening logo reveals as well as dynamic nomination slide templates optimized specifically for massive stage LED screens.",
    thumbnailUrl: "https://img.youtube.com/vi/zgqqGUzrqFA/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/zgqqGUzrqFA",
    role: "Event Motion Specialist",
    tools: ["Adobe After Effects", "Adobe Premiere Pro", "Adobe Photoshop"],
    deliverables: ["Ultra-wide LED Screen Visuals", "Event Bumpers", "Looping Backgrounds", "Speaker Title Animations"],
    highlights: [
      "Premium and luxurious crystal particle simulation blend",
      "High typographic legibility optimized for nighttime event stage lighting",
      "Highly stable transition systems designed for flawless execution by physical stage production crews"
    ]
  },
  {
    id: "yakesma-indonesia-collaboration-award",
    title: "YAKESMA INDONESIA COLABORATION AWARD",
    category: "Bumper Event",
    date: "February 2026",
    description: "Designed and rendered sleek motion graphic assets for the Yakesma Indonesia Collaboration Award ceremony. Produced majestic award logo reveals and speaker/nominee category bumpers for widescreen stage LED boards.",
    thumbnailUrl: "https://img.youtube.com/vi/X90ZqypMGZ4/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/X90ZqypMGZ4",
    role: "Motion Graphic Designer",
    tools: ["Adobe After Effects", "Premiere Pro", "Illustrator", "Photoshop", "Capcut"],
    deliverables: ["Ultra-wide LED Screen Visuals", "Event Bumpers", "Looping Backgrounds", "Speaker Title Animations"],
    highlights: [
      "Inspiring corporate-philanthropic aesthetic design lines",
      "High-legibility nominee and speaker profile layouts",
      "Custom-timed audio and logo-reveal alignments for real-time cues"
    ]
  },
  {
    id: "mazda-award",
    title: "Mazda Dealer Excellence Award 2025",
    category: "Bumper Event",
    date: "February 2026",
    description: "Developed and delivered a versatile range of video bumpers for the event, including opening bumpers and speaker segments. Managed tight, fast-paced deadlines and executed real-time revisions on-site during the live event.",
    thumbnailUrl: "https://img.youtube.com/vi/AxChXCDWV6o/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/AxChXCDWV6o",
    role: "Motion Graphic Designer",
    tools: ["Adobe After Effects", "Premiere Pro", "Illustrator", "Photoshop", "Capcut"],
    deliverables: ["Ultra-wide LED Screen Visuals", "Event Bumpers", "Looping Backgrounds", "Speaker Title Animations"],
    highlights: [
      "Versatile range of video bumpers",
      "Real-time on-site revisions",
      "Live production schedule alignment"
    ]
  },
  {
    id: "pn-cilacap",
    title: "Pengadilan Negeri Cilacap",
    category: "Motion Graphic Animation",
    date: "October 2025",
    description: "Applied fundamental animation principles to animate assets and characters, ensuring fluid, seamless, and natural movements throughout the video. Composed all visual scenes and added specialized SFX.",
    thumbnailUrl: "https://img.youtube.com/vi/pfO3PJFv50M/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/pfO3PJFv50M",
    highlights: [
      "Fundamental animation principles",
      "Character animation",
      "Specialized SFX integration"
    ]
  },
  {
    id: "indofood-racik",
    title: "Indofood - Racik Bumbu Special Balado",
    category: "Commercial Video",
    date: "October 2025",
    description: "Crafted dynamic video advertising assets for Indofood's 'Racik Bumbu Special Balado' campaign. Integrated high-quality motion typography and specialized VFX to create an engaging visual experience.",
    thumbnailUrl: "https://img.youtube.com/vi/5ti2YSfWEl4/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/5ti2YSfWEl4",
    highlights: [
      "Dynamic advertising assets",
      "High-quality motion typography",
      "Advanced rotoscoping techniques"
    ]
  },
  {
    id: "mandiri-golfcard-2025-award",
    title: "Mandiri Golf Card Tournament 2025 - Award Loop",
    category: "Bumper Event",
    date: "September 2025",
    description: "Engineered high-end award ceremony presenter frames, champion announce buffers, and sponsor visual loops to light up the Mandiri Golf Card Tournament closing dinner.",
    thumbnailUrl: "https://img.youtube.com/vi/0z5RAxww9Qo/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/0z5RAxww9Qo",
    role: "Lead Event Animator",
    tools: ["Adobe After Effects", "Illustrator", "Premiere Pro"],
    deliverables: ["Ultra-wide LED Screen Visuals", "Event Bumpers", "Looping Backgrounds", "Speaker Title Animations"],
    highlights: [
      "Majestic slow-motion abstract gold overlays",
      "Ultra-wide layout structures for maximum attendee impact",
      "Crisp typographic structures for real-time visibility"
    ]
  },
  {
    id: "dasher-playground-adventure",
    title: "English Academy by Ruangguru - DASHER: The Playground Adventure",
    category: "Motion Graphic Animation",
    date: "July 2025",
    description: "Director & Lead Animator for the interactive curriculum animation video 'DASHER: The Playground Adventure' from Ruangguru's English Academy. Developed a lively integration of cheerful 2D character animation, high-resolution child-friendly background visuals, and dynamic kinetic transitions to spark children's English learning adventure.",
    thumbnailUrl: "https://img.youtube.com/vi/p96SeVyhulY/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/p96SeVyhulY",
    role: "Lead 2D Animator & Scene Compositor",
    tools: ["Adobe After Effects", "Adobe Illustrator", "Character Animator"],
    deliverables: ["2D Character Rigging & Animation", "Educational Motion Graphics Elements", "Children Course Graphics Asset Guide"],
    highlights: [
      "Applied dynamic animation principles for smooth, fluid, and lifelike character movements",
      "Vibrant and enchanting visual layouts proven to stimulate children's learning enthusiasm",
      "Immersive sound design synchronization and high-precision character lip-syncing"
    ]
  },
  {
    id: "elysyle-anniversary-2025",
    title: "ELYSYLE ANNIVERSARY CELEBRATION 2025",
    category: "Bumper Event",
    date: "July 2025",
    description: "Designed and animated a spectacular 1st anniversary celebration bumper for 'ELYSYLE'. Created custom high-fidelity logo reveals, motion transitions, and anniversary visual triggers optimized for large-scale LED venue screens.",
    thumbnailUrl: "https://img.youtube.com/vi/5NoPbkgRWUE/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/5NoPbkgRWUE",
    role: "Motion Graphic Designer",
    tools: ["Adobe After Effects", "Premiere Pro", "Illustrator", "Photoshop", "Capcut"],
    deliverables: ["Ultra-wide LED Screen Visuals", "Event Bumpers", "Looping Backgrounds", "Speaker Title Animations"],
    highlights: [
      "Dynamic 1st-anniversary ceremonial opener",
      "Vibrant particles, luxury theme, and custom logo reveals",
      "Optimized specifically for high-brightness large LED backdrops"
    ]
  },
  {
    id: "speequal-gaming-profile",
    title: "Company Profile Speequal Gaming",
    category: "Other Project",
    date: "June 2025",
    description: "An ultra-modern, stylized video showcase highlighting 'Speequal Gaming'. Designed with lively neon gradients, gaming HUD elements, and digital glimmers representing custom esports media solutions.",
    thumbnailUrl: "https://img.youtube.com/vi/NY6a9iTDCHc/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/NY6a9iTDCHc",
    role: "Motion Graphic Specialist",
    tools: ["Adobe After Effects", "Premiere Pro", "Photoshop", "Illustrator"],
    deliverables: ["Esports Corporate Loop", "Gaming-themed Kinetic Texts", "Social Media Trailers"],
    highlights: [
      "Stunning cyberpunk visual environment designs",
      "Fast-paced energetic editing capturing tech audiences",
      "Bespoke motion logos tailored for competitive media teams"
    ]
  },
  {
    id: "mandiri-golfcard-2025",
    title: "Mandiri Golf Card Tournament 2025 - Intro Bumper",
    category: "Bumper Event",
    date: "April 2025",
    description: "Developed futuristic corporate sport openers and interactive scoreboard bumpers for the prestigious Mandiri Golf Card Tournament 2025. Tailored specifically with high-contrast lines for vibrant tournament arena screens.",
    thumbnailUrl: "https://img.youtube.com/vi/FPWUWoiw0fc/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/FPWUWoiw0fc",
    role: "Event Lead Artist",
    tools: ["Adobe After Effects", "Premiere Pro", "Photoshop"],
    deliverables: ["Ultra-wide LED Screen Visuals", "Event Bumpers", "Looping Backgrounds", "Speaker Title Animations"],
    highlights: [
      "High fidelity athletic lines and movement grids",
      "Perfect alignment with Mandiri's premium brand guidelines",
      "Exciting transitions leading up to player reveals"
    ]
  },
  {
    id: "speequal-profile",
    title: "Company Profile SPEEQUAL",
    category: "Other Project",
    date: "February 2025",
    description: "A strategic, high-production company profile detailing SPEEQUAL's premium corporate services. Illustrates how integrating speed, top-tier build quality, and extreme precision drives digital business progress.",
    thumbnailUrl: "https://img.youtube.com/vi/lXyretYK-gM/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/lXyretYK-gM",
    role: "Corporate Video Producer",
    tools: ["Adobe After Effects", "Illustrator", "Premiere Pro"],
    deliverables: ["Company Showcase Film", "Interactive Business Typographies", "Brand Accent Motifs"],
    highlights: [
      "Clean integration of corporate style-guide patterns",
      "Lively vector icons mapping speed, quality, and precision metrics",
      "Sophisticated staccato pacing to convey corporate momentum"
    ]
  },
  {
    id: "mazda-excellence-2024",
    title: "Mazda Dealer Excellence Award 2024",
    category: "Bumper Event",
    date: "February 2025",
    description: "Produced premium logo animations, dealer award categories, and presenter introduction bumpers for the annual Mazda Dealer Excellence Award. Delivers sleek brand synergy centered around performance and sophistication.",
    thumbnailUrl: "https://img.youtube.com/vi/ue7byWeeR4s/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/ue7byWeeR4s",
    role: "Motion Designer",
    tools: ["Adobe After Effects", "Premiere Pro", "Illustrator"],
    deliverables: ["Ultra-wide LED Screen Visuals", "Event Bumpers", "Looping Backgrounds", "Speaker Title Animations"],
    highlights: [
      "Clean modern auto mechanics visual feel",
      "Polished metallic logo treatments",
      "Stunning transition effects matching Mazda's Soul of Motion language"
    ]
  },
  {
    id: "dirtik-imigrasi",
    title: "DIRTIK IMIGRASI",
    category: "Motion Graphic Animation",
    date: "December 2024",
    description: "Utilized professional animation techniques to bring character assets to life, delivering smooth and seamless transitions that effectively illustrated core concepts of DIRTIK IMIGRASI.",
    thumbnailUrl: "https://img.youtube.com/vi/aRNfMO3FaDw/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/aRNfMO3FaDw",
    highlights: [
      "Professional character animation",
      "Seamless concept transitions",
      "Audio effects synchronization"
    ]
  },
  {
    id: "pln-public-safety",
    title: "Video Public Area Gedung PLN",
    category: "Other Project",
    date: "December 2024",
    description: "An animated safety explainer illustrating evacuation guidelines, assembly points, and public safety regulations inside the PLN headquarters building. Built with prominent vectors for fast recognition in safety training programs.",
    thumbnailUrl: "https://img.youtube.com/vi/fQ1rlsfO8BE/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/fQ1rlsfO8BE",
    role: "Lead Motion Animator",
    tools: ["Adobe After Effects", "Illustrator", "Premiere Pro"],
    deliverables: ["Public Evacuation Video", "Emergency Infographic Panels", "Looping Safety Displays"],
    highlights: [
      "Incredibly clear step-by-step vector path indications",
      "High-contrast warning layouts following corporate guidelines",
      "Clean simplified representation of building architectural assets"
    ]
  },
  {
    id: "anggur-merah-launching",
    title: "OT - ANGGUR MERAH Product Launch Bumper Logo",
    category: "Other Project",
    date: "December 2024",
    description: "Conceptualized and rendered a premium animated logo bumper video for the prestigious ANGGUR MERAH product launch by Orang Tua (OT) Group. Combines the rich heritage of a classic brand with modern camera motion techniques and maroon-gold ambient lighting that exudes pure luxury.",
    thumbnailUrl: "https://img.youtube.com/vi/gkJ8Hw2qMlw/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/gkJ8Hw2qMlw",
    role: "Motion Graphic Visual Artist",
    tools: ["Adobe After Effects", "Adobe Illustrator", "Premiere Pro"],
    deliverables: ["Animated Premium Logo Reveals", "Broadcast Ready Visual Assets", "Dynamic Sound-Sync Opener"],
    highlights: [
      "Exquisite dynamic lighting details with exclusive maroon-gold color grading",
      "Dynamic motion design focusing on highlighting the authentic product silhouette",
      "Highly versatile format optimized for physical events and digital marketing campaigns"
    ]
  },
  {
    id: "project-jafra-elysyle",
    title: "PROJECT JAFRA ELYSYLE",
    category: "Bumper Event",
    date: "July 2024",
    description: "Created a suite of energetic, luxury-styled event bumpers for the JAFRA ELYSYLE product launch. Built high-impact logo reveals, individual speaker announcement assets, and product unveiling transitions calibrated for live venue screens.",
    thumbnailUrl: "https://img.youtube.com/vi/WVafUvRHILc/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/WVafUvRHILc",
    role: "Motion Graphic Designer",
    tools: ["Adobe After Effects", "Premiere Pro", "Illustrator", "Photoshop", "Capcut"],
    deliverables: ["Ultra-wide LED Screen Visuals", "Event Bumpers", "Looping Backgrounds", "Speaker Title Animations"],
    highlights: [
      "Vibrant and sophisticated gold/particle themed animations",
      "Seamless presenter transitions and brand logo reveals",
      "Specially designed to capture attention on dual-wing LED setups"
    ]
  },
  {
    id: "imigrasi-services",
    title: "SIMKIM v.2.0 - Direktorat Jenderal Imigrasi",
    category: "Motion Graphic Animation",
    date: "June 2024",
    description: "An in-depth corporate animation detailing the comprehensive integrated database and digital infrastructure managed by the Indonesian Directorate General of Immigration to monitor and welcome incoming foreign nationals.",
    thumbnailUrl: "https://img.youtube.com/vi/IruMwIZfwl4/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/IruMwIZfwl4",
    role: "Motion Designer & Editor",
    tools: ["Adobe After Effects", "Illustrator", "Premiere Pro"],
    deliverables: ["Full Explainer Animation", "Dynamic Vector Diagrams", "Airport Process Mockups"],
    highlights: [
      "High tech interface diagrams mapping national check-points",
      "Clear flowcharting of passport and visa processing pipelines",
      "Authoritative system presentation layout"
    ]
  },
  {
    id: "bsi-tournament-2024",
    title: "BSI Tournament 2024 - Event Opener",
    category: "Bumper Event",
    date: "May 2024",
    description: "Created majestic event openers, animated logo reveals, and custom nomination slide bumpers for the BSI Tournament 2024. Calibrated with high contrast, glowing particles, and athletic design lines for physical stadium-sized LED displays.",
    thumbnailUrl: "https://img.youtube.com/vi/rP2pB_y833w/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/rP2pB_y833w",
    role: "Motion Graphic Designer",
    tools: ["Adobe After Effects", "Illustrator", "Premiere Pro"],
    deliverables: ["Ultra-wide LED Screen Visuals", "Event Bumpers", "Looping Backgrounds", "Speaker Title Animations"],
    highlights: [
      "Modern dynamic typographic flows and metallic textures",
      "Shimmering gold and green lighting cues",
      "High readability optimized for large venue screens"
    ]
  },
  {
    id: "bsi-tournament-2024-nomination",
    title: "BSI Tournament 2024 - Nomination Loop",
    category: "Bumper Event",
    date: "May 2024",
    description: "Designed high-fidelity nomination bumpers, looping background plates, and presentation slides for the grand BSI Tournament 2024 ceremony, ensuring seamless real-time visual execution as winner categories were announced.",
    thumbnailUrl: "https://img.youtube.com/vi/SOoo0-2KAQs/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/SOoo0-2KAQs",
    role: "Motion Graphic Designer",
    tools: ["Adobe After Effects", "Premiere Pro", "Capcut"],
    deliverables: ["Ultra-wide LED Screen Visuals", "Event Bumpers", "Looping Backgrounds", "Speaker Title Animations"],
    highlights: [
      "Subtle shimmering abstract corporate patterns",
      "Fluid particle motion trajectories",
      "Flawless loop blending for physical LED playbacks"
    ]
  },
  {
    id: "mandiri-golfcard-tournament",
    title: "MANDIRI GOLFCARD TOURNAMENT",
    category: "Bumper Event",
    date: "May 2024",
    description: "Developed dynamic broadcast-ready event assets for the Mandiri Golfcard Tournament, including modern animated logo bumpers and elegant nomination slides custom-tailored for high-impact LED displays.",
    thumbnailUrl: "https://img.youtube.com/vi/6Gnn79v63zk/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/6Gnn79v63zk",
    role: "Motion Graphic Designer",
    tools: ["Adobe After Effects", "Premiere Pro", "Illustrator", "Photoshop", "Capcut"],
    deliverables: ["Ultra-wide LED Screen Visuals", "Event Bumpers", "Looping Backgrounds", "Speaker Title Animations"],
    highlights: [
      "Clean, sophisticated athletic-themed movement patterns",
      "Designed dedicated LED bumper loops and nominee transitions",
      "Tailored to align with Bank Mandiri's premium corporate identity"
    ]
  },
  {
    id: "mandiri-golf-tournament-2024",
    title: "Mandiri Group Golf Tournament 2024",
    category: "Bumper Event",
    date: "April 2024",
    description: "Developed bespoke high-voltage video logo bumpers and executive nomination slide loops for the Mandiri Group Golf Tournament 2024. Specially formatted and optimized for high-brightness arena LED screens under live broadcast conditions.",
    thumbnailUrl: "https://img.youtube.com/vi/pjNHNtJtY_4/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/pjNHNtJtY_4",
    role: "Event Motion Specialist",
    tools: ["Adobe After Effects", "Photoshop", "Premiere Pro"],
    deliverables: ["Ultra-wide LED Screen Visuals", "Event Bumpers", "Looping Backgrounds", "Speaker Title Animations"],
    highlights: [
      "Majestic corporate-athletic aesthetic branding",
      "Strict compliance with Bank Mandiri's premium design guidelines",
      "Engineered for high-brightness physical stages"
    ]
  },
  {
    id: "nioblu-natural-beauty-science",
    title: "NIOBLU - NATURAL BEAUTY SCIENCE",
    category: "Bumper Event",
    date: "February 2024",
    description: "Produced an engaging visual sequence for the NIOBLU product launch and corporate rebranding transition. Developed main brand logo idents, key product launch trailers, and presenter speaker transitions for state-of-the-art stage LEDs.",
    thumbnailUrl: "https://img.youtube.com/vi/hOlFXfIPmZg/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/hOlFXfIPmZg",
    role: "Motion Graphic Designer",
    tools: ["Adobe After Effects", "Premiere Pro", "Illustrator", "Photoshop", "Capcut"],
    deliverables: ["Ultra-wide LED Screen Visuals", "Event Bumpers", "Looping Backgrounds", "Speaker Title Animations"],
    highlights: [
      "Smooth, organic visual flows representing 'Natural Beauty Science'",
      "Dynamic rebranding identity reveal sequencing",
      "Bespoke high-contrast 3D product rendering overlays for live displays"
    ]
  },
  {
    id: "padi-umkm-empower",
    title: "Video PaDi UMKM",
    category: "Motion Graphic Animation",
    date: "February 2024",
    description: "An engaging, colorful motion graphics explainer showing how PaDi UMKM streamlines national B2B procurement, helping local small and medium enterprises (MSMEs) run their business operations with efficiency and reach new markets.",
    thumbnailUrl: "https://img.youtube.com/vi/aGpoXOD84kc/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/aGpoXOD84kc",
    role: "Motion Graphic Designer",
    tools: ["Adobe After Effects", "Illustrator", "Premiere Pro"],
    deliverables: ["Character rigged layouts", "Platform UI flow simulations", "Final localized explanatory video"],
    highlights: [
      "Energetic custom vector character rigging",
      "Seamless icon-based feature breakdowns",
      "Eye-catching corporate branding animations"
    ]
  },
  {
    id: "wootag-intent-ai",
    title: "WOOTAG Intent",
    category: "Other Project",
    date: "September 2023",
    description: "A fast-paced digital promotion and interactive campaign introducing the 'WOOTAG Intent' behavior-tracking platform. Combines modern neon interfaces, cybernetic grids, and kinetic texts to explain the intelligence engine.",
    thumbnailUrl: "https://img.youtube.com/vi/bRdjKOcew30/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/bRdjKOcew30",
    role: "Motion Designer",
    tools: ["Adobe After Effects", "Premiere Pro", "Illustrator"],
    deliverables: ["Product Launch Reel", "Dynamic Holographic Overlays", "Sound Design Syncs"],
    highlights: [
      "Futuristic neural network graphics tracking user focus",
      "Crisp user interface simulation segments",
      "Vibrant cyber-color profiles optimized for tech buyers"
    ]
  },
  {
    id: "iodine-malnutrition-indonesia",
    title: "Digital Solution to Fight Iodine Malnutrition in Indonesia",
    category: "Other Project",
    date: "August 2023",
    description: "An educational public healthcare explainer discussing digital tracking solutions and technological approaches designed to tackle and solve iodine malnutrition across various regions of Indonesia.",
    thumbnailUrl: "https://img.youtube.com/vi/AVChhtKglJg/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/AVChhtKglJg",
    role: "Lead Animator & Editor",
    tools: ["Adobe After Effects", "Illustrator", "Premiere Pro"],
    deliverables: ["Public Health Explainer Video", "Interactive Geographic Maps", "Data Infographics"],
    highlights: [
      "Clean interactive visual mapping of region-specific statistics",
      "Highly recognizable warning indicators and data overlays",
      "Persuasive public narrative animation"
    ]
  },
  {
    id: "kesbangpol-politik-uang",
    title: "KESBANGPOL PEKANBARU - MONEY POLITICS",
    category: "Motion Graphic Animation",
    date: "August 2023",
    description: "These are educational videos regarding the election of 2024 in Pekanbaru City, Indonesia. Explain about Money Politics",
    thumbnailUrl: "https://img.youtube.com/vi/5o2TJUAYf_k/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/5o2TJUAYf_k",
    highlights: [
      "Educational campaign for the election of 2024 in Pekanbaru City",
      "Deconstructs the dangers of bribery and Money Politics in a democratic process",
      "Interactive storylines and character vectors mapping sincere voting values"
    ]
  },
  {
    id: "dprd-pekanbaru-reses",
    title: "DPRD KOTA PEKANBARU - RESES",
    category: "Motion Graphic Animation",
    date: "August 2023",
    description: "An elegant, highly educational motion graphics video detailing the legislative recess (Reses) programs of the Pekanbaru City Regional House of Representatives. Designed to simplify civic functions, it clearly explains how council members gather, discuss, and advocate for local community aspirations.",
    thumbnailUrl: "https://img.youtube.com/vi/kceTU5El7aM/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/kceTU5El7aM",
    role: "Lead Motion Designer & Animator",
    tools: ["Adobe After Effects", "Adobe Illustrator", "Premiere Pro"],
    deliverables: ["2D Character Animations", "Regional Legislative Infographics", "Process Flow Diagram Overlays"],
    highlights: [
      "Transformed complex regional legislative procedures into clean, friendly visual guides",
      "Dynamic 2D character rigging and smooth transition designs optimized for public viewers",
      "Engaging narratives detailing the democratic channels of citizen aspiration gathering"
    ]
  },
  {
    id: "kesbangpol-hoax",
    title: "KESBANGPOL PEKANBARU - HOAX",
    category: "Motion Graphic Animation",
    date: "July 2023",
    description: "These are educational videos regarding the election of 2024 in Pekanbaru City, Indonesia. Explain about Hoaxes",
    thumbnailUrl: "https://img.youtube.com/vi/5kp59fo40hg/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/5kp59fo40hg",
    highlights: [
      "Educational campaign for the election of 2024 in Pekanbaru City",
      "Focused on addressing and explaining misinformation, fake news, and Hoaxes",
      "Utilized custom visual cues and animations for fast conceptual understanding"
    ]
  },
  {
    id: "mercedes-benz-dealer-meeting-2023",
    title: "MERCEDES BENZ - NATIONAL DEALER MEETING 2023",
    category: "Bumper Event",
    date: "July 2023",
    description: "Crafted a series of premium, high-end motion graphics for the Mercedes-Benz National Dealer Meeting 2023. Created corporate logo bumpers and sleek speaker introduction screens designed for high-resolution LED stages.",
    thumbnailUrl: "https://img.youtube.com/vi/IFCGBOJ3Cag/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/IFCGBOJ3Cag",
    role: "Motion Graphic Designer",
    tools: ["Adobe After Effects", "Premiere Pro", "Illustrator", "Photoshop", "Capcut"],
    deliverables: ["Ultra-wide LED Screen Visuals", "Event Bumpers", "Looping Backgrounds", "Speaker Title Animations"],
    highlights: [
      "Elegant chrome typography animations & luxury asset styling",
      "Custom-timed presenter & speaker introduction bumpers",
      "Engineered for immersive widescreen stage environment displays"
    ]
  },
  {
    id: "polaris-telkomsel",
    title: "Polaris Telkomsel",
    category: "Motion Graphic Animation",
    date: "May 2023",
    description: "This animation explains the Polaris-Telkomsel programs such as Polaris Founders, Polaris Ideation, and Polaris Incubation",
    thumbnailUrl: "https://img.youtube.com/vi/Cp4QK7jCl9s/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/Cp4QK7jCl9s",
    highlights: [
      "Polaris Founders – Introducing leadership and foundational tracks.",
      "Polaris Ideation – Highlighting creative and problem-solving stages.",
      "Polaris Incubation – Spotlighting development and acceleration initiatives."
    ]
  },
  {
    id: "kesbangpol-jangan-golput",
    title: "KESBANGPOL PEKANBARU - CHOOSE TO VOTE (DON'T ABSTAIN)",
    category: "Motion Graphic Animation",
    date: "May 2023",
    description: "These are educational videos regarding the election of 2024 in Pekanbaru City, Indonesia. explain about Abstention election (GOLPUT)",
    thumbnailUrl: "https://img.youtube.com/vi/4YAWyZWUMyU/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/4YAWyZWUMyU",
    highlights: [
      "Educational campaign for the election of 2024 in Pekanbaru City",
      "Explain the context, background, and impact of Abstention election (GOLPUT)",
      "Designed with highly engaging educational typography and motion graphics assets"
    ]
  },
  {
    id: "wootag-biz-profile",
    title: "Company Profile Wootag Biz",
    category: "Motion Graphic Animation",
    date: "March 2023",
    description: "An elegant, stylized company profile showcasing Wootag Biz. Illustrates complex digital interactions and product marketing solutions utilizing clean minimal layouts, vector assets, and brand-authentic color gradients.",
    thumbnailUrl: "https://img.youtube.com/vi/-m9YNH5GkJE/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/-m9YNH5GkJE",
    role: "Motion Graphic Specialist",
    tools: ["Adobe After Effects", "Illustrator", "Photoshop"],
    deliverables: ["Explainer Animation Video", "Modern UI Templates", "Vector Iconography Sets"],
    highlights: [
      "Smooth data visualization patterns",
      "High fidelity user interface showcase frames",
      "Engaging staccato kinetic editing structure"
    ]
  },
  {
    id: "masjid-al-jabbar-kolonial",
    title: "Al-Jabbar Grand Mosque Gallery - Dutch Colonial Policy on Islam",
    category: "Motion Graphic Animation",
    date: "January 2023",
    description: "Produced an immersive, museum-grade historical documentary animation exploring the Dutch Colonial Policy towards Islam in the Indonesian Archipelago, custom-designed for continuous playback at the Al-Jabbar Grand Mosque Gallery in Bandung. Blends vintage archival illustrations, animated historical maps, and dramatic transition sequences to deliver a rich educational experience for the general public.",
    thumbnailUrl: "https://img.youtube.com/vi/HtVk7-j94Ck/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/HtVk7-j94Ck",
    role: "Motion Graphic Designer & Historical Content Editor",
    tools: ["Adobe After Effects", "Adobe Illustrator", "Adobe Photoshop", "Premiere Pro"],
    deliverables: ["Exhibition Video Showcase", "Historical Asset Animation", "Archival Map Infographics"],
    highlights: [
      "Sophisticated and dramatic classic heritage-themed color palette",
      "Modern storytelling rhythm without losing historical context and solemnity",
      "Technically verified and optimized for seamless loop playback on museum gallery screens"
    ]
  },
  {
    id: "ruangguru-dafa-lulu",
    title: "RUANGGURU: DAFA & LULU ANIMATION",
    category: "Motion Graphic Animation",
    date: "May 2021 - September 2022",
    description: "Dafa & Lulu is a video learning project by Ruangguru. Animated characters assets that have been provided by graphic designers into a video learning project for elementary school children in grades 4, 5, 6 using Adobe After Effects.",
    thumbnailUrl: "https://img.youtube.com/vi/e1-VRh6km4c/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/e1-VRh6km4c",
    highlights: [
      "Animated complex character assets provided by designers into high-quality study materials",
      "Developed content specifically targeted for elementary school grades 4, 5, and 6",
      "Utilized Adobe After Effects to deliver lively, captivating educational animation series"
    ]
  },
  {
    id: "bambang-suprihanto-farewell",
    title: "Biografi Farewell Bambang Suprihanto",
    category: "Motion Graphic Animation",
    date: "December 2021",
    description: "A heartfelt motion biography celebrating the career and retirement of Bambang Suprihanto. Crafted with elegant photo memory overlays, clean sliding paths, and transition narratives reflecting major life achievements.",
    thumbnailUrl: "https://img.youtube.com/vi/o8CVyfAzDUE/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/o8CVyfAzDUE",
    role: "Motion Designer & Animator",
    tools: ["Adobe After Effects", "Premiere Pro", "Photoshop", "Illustrator"],
    deliverables: ["Tribute Animation", "Transition Overlays", "Dynamic Retrospective Tracks"],
    highlights: [
      "Heartfelt photographic retrospective timeline",
      "Seamless and elegant camera-panning transitions",
      "Custom brand-aligned typography layout"
    ]
  },
  {
    id: "adab-sunnah-tpa",
    title: "Self-Adab Animation Series",
    category: "Motion Graphic Animation",
    date: "February 2021",
    description: "An animated thesis project developed for the Fine Art Education Program. The series illustrates daily routines and habits rooted in Islamic manners (Adab and Sunnah). It is designed to be both educational and entertaining for children aged 7 to 9 in Qur'an Education Centers (TPA).",
    thumbnailUrl: "https://img.youtube.com/vi/7pgr_Ycqa0I/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/7pgr_Ycqa0I",
    highlights: [],
    episodes: [
      {
        title: "Prolog",
        videoUrl: "https://www.youtube.com/embed/7pgr_Ycqa0I"
      },
      {
        title: "Episode 1",
        videoUrl: "https://www.youtube.com/embed/mcDjlKhrb1M"
      },
      {
        title: "Episode 2",
        videoUrl: "https://www.youtube.com/embed/BH2qEkotSBE"
      },
      {
        title: "Episode 3",
        videoUrl: "https://www.youtube.com/embed/PIFtAlDT8BU?si=ZFcDl41geppjfj80"
      },
      {
        title: "Episode 4",
        videoUrl: "https://www.youtube.com/embed/migKaY_FmkU?si=poeDpKr29oDWnzQj"
      },
      {
        title: "Episode 5",
        videoUrl: "https://www.youtube.com/embed/vlPLRhVWTY0?si=IAWDnQttaINzeR4u"
      }
    ]
  }
];
