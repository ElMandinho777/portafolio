import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Compass,
  Rocket,
  Orbit,
  Terminal,
  Radio,
  Pause,
  Play,
  FastForward,
  BookOpen,
  Sparkles,
  ChevronRight,
  Activity,
  Cpu,
  Eye,
  EyeOff,
  Globe,
  Info,
} from "lucide-react";

import Starfield from "./components/Starfield";
import Planet from "./components/Planet";
import ProjectModal from "./components/ProjectModal";
import AboutPanel from "./components/AboutPanel";
import ContactModal from "./components/ContactModal";
import { projectsData } from "./projectsData";
import { Project } from "./types";

export default function App() {
  // App Phase: 'loading' | 'warp' | 'solar_system'
  const [appState, setAppState] = useState<"loading" | "warp" | "solar_system">("loading");
  
  // Simulation States
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [orbitSpeedFactor, setOrbitSpeedFactor] = useState(1); // 0.25, 1, 3 (hyperdrive)
  const [showOrbits, setShowOrbits] = useState(true);
  const [autopilot, setAutopilot] = useState(false);
  const [activePlanetIndex, setActivePlanetIndex] = useState<number | null>(null);

  // Navigation drag-to-pan states
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggedDistance, setDraggedDistance] = useState(0);

  // Layout & Navigation Overlays
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [warpProgress, setWarpProgress] = useState(0);
  const [scaleFactor, setScaleFactor] = useState(1);

  // Dynamic Stardate
  const [starDate, setStarDate] = useState("");

  // Calculate Stardate on tick
  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const year = now.getFullYear();
      const start = new Date(year, 0, 0);
      const diff = now.getTime() - start.getTime();
      const oneDay = 1000 * 60 * 60 * 24;
      const day = Math.floor(diff / oneDay);
      // Milliseconds of day as decimal
      const msSinceMidnight = now.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const fractionalDay = (msSinceMidnight / (1000 * 60 * 60 * 24)).toFixed(3);
      setStarDate(`${year}.${day}${fractionalDay.substring(2)}`);
    };

    updateDate();
    const interval = setInterval(updateDate, 1000);
    return () => clearInterval(interval);
  }, []);

  // Warp Simulation Loader
  useEffect(() => {
    if (appState === "loading") {
      // Small pause on launcher deck before firing warp
      const t = setTimeout(() => {
        setAppState("warp");
      }, 800);
      return () => clearTimeout(t);
    }

    if (appState === "warp") {
      const interval = setInterval(() => {
        setWarpProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            // Smoothly transition into the solar system dashboard
            setTimeout(() => {
              setAppState("solar_system");
            }, 600);
            return 100;
          }
          // Increment exponentially for a sense of speed
          const inc = prev < 40 ? 4 : prev < 75 ? 8 : 12;
          return Math.min(100, prev + inc);
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [appState]);

  // Orbit animation ticker
  useEffect(() => {
    // Detener el renderizado orbital mientras hay un panel abierto evita
    // reconstruir su contenido en cada cuadro y mantiene fluido el scroll.
    if (isPaused || appState !== "solar_system" || isAboutOpen || isContactOpen || selectedProject !== null) return;

    let animId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      // Increment time parameter based on factor
      setTime((prev) => prev + delta * 0.12 * orbitSpeedFactor);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, orbitSpeedFactor, appState, isAboutOpen, isContactOpen, selectedProject]);

  // Autopilot planetary tour loop
  useEffect(() => {
    if (!autopilot || appState !== "solar_system" || selectedProject !== null) return;

    const interval = setInterval(() => {
      setActivePlanetIndex((prev) => {
        const nextIdx = prev === null || prev >= projectsData.length - 1 ? 0 : prev + 1;
        setSelectedProject(projectsData[nextIdx]);
        return nextIdx;
      });
    }, 7000);

    return () => clearInterval(interval);
  }, [autopilot, appState, selectedProject]);

  // Dynamic Scale Factor for responsiveness
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setScaleFactor(0.40);
      } else if (width < 640) {
        setScaleFactor(0.50);
      } else if (width < 768) {
        setScaleFactor(0.62);
      } else if (width < 1024) {
        setScaleFactor(0.80);
      } else if (width < 1280) {
        setScaleFactor(0.92);
      } else {
        setScaleFactor(1.0);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Shifting load statements for warp intro phase
  const warpStatusText = useMemo(() => {
    if (warpProgress < 20) return "CALIBRANDO PROPULSORES DE PLASMA...";
    if (warpProgress < 40) return "TRAZANDO COORDENADAS ORBITALES EN EL MAPA...";
    if (warpProgress < 60) return "SENSANDO FIRMAS DE RADIACIÓN DE PROYECTOS...";
    if (warpProgress < 80) return "SITUANDO SENSOR EN COORDENADAS DE ACELERACIÓN...";
    if (warpProgress < 100) return "SEÑAL CONECTADA. INICIANDO DESPLIEGUE EN 3, 2, 1...";
    return "¡ÓRBITA DETECTADA! ESTABILIZANDO NAVE...";
  }, [warpProgress]);

  // Custom function to handle custom speed changes (playing warp animation)
  const handleWarpOverride = () => {
    setAppState("warp");
    setWarpProgress(0);
    setSelectedProject(null);
    setPan({ x: 0, y: 0 }); // reset pan on warp
  };

  // Drag-to-pan handlers for navigation
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // only left click
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a") || target.closest(".project-modal") || target.closest(".contact-modal") || target.closest(".about-panel")) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    setDraggedDistance(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Calculate total dragged distance to distinguish clicks from drags
    const dx = newX - pan.x;
    const dy = newY - pan.y;
    setDraggedDistance((prev) => prev + Math.sqrt(dx * dx + dy * dy));

    setPan({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a") || target.closest(".project-modal") || target.closest(".contact-modal") || target.closest(".about-panel")) {
      return;
    }
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    setDraggedDistance(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;

    const dx = newX - pan.x;
    const dy = newY - pan.y;
    setDraggedDistance((prev) => prev + Math.sqrt(dx * dx + dy * dy));

    setPan({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Helper to scale project properties based on responsive scaleFactor
  const scaledProjects = useMemo(() => {
    return projectsData.map((p) => ({
      ...p,
      size: p.size * (scaleFactor < 0.6 ? 0.8 : 1), // don't shrink too small on mobile
      orbitRadius: p.orbitRadius * scaleFactor,
    }));
  }, [scaleFactor]);

  return (
    <div className="relative min-h-screen bg-black text-slate-100 overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Background Starfield (Interactive and adaptive with drag parallax!) */}
      <Starfield
        mode={appState === "warp" ? "warp" : "drift"}
        speedMultiplier={orbitSpeedFactor === 3 ? 2.5 : 1}
        panOffset={pan}
      />

      {/* Grid lines layout overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />

      {/* Holographic scanning overlay effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)] pointer-events-none z-10" />

      {/* ================= PHASE 1 & 2: INTRO LOADING & WARP SPEED ================= */}
      <AnimatePresence>
        {(appState === "loading" || appState === "warp") && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-black/90 select-none"
          >
            {/* HUD Bracket Border design */}
            <div className="absolute top-8 left-8 border-t-2 border-l-2 border-slate-700 w-12 h-12 rounded-tl-lg pointer-events-none opacity-45" />
            <div className="absolute top-8 right-8 border-t-2 border-r-2 border-slate-700 w-12 h-12 rounded-tr-lg pointer-events-none opacity-45" />
            <div className="absolute bottom-8 left-8 border-b-2 border-l-2 border-slate-700 w-12 h-12 rounded-bl-lg pointer-events-none opacity-45" />
            <div className="absolute bottom-8 right-8 border-b-2 border-r-2 border-slate-700 w-12 h-12 rounded-br-lg pointer-events-none opacity-45" />

            <div className="text-center max-w-md w-full space-y-6">
              {/* Spinning Logo Bracket */}
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 border border-dashed border-cyan-500/40 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                />
                <motion.div
                  className="absolute w-20 h-20 border border-slate-800 rounded-full flex items-center justify-center bg-slate-950/60"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Rocket className="w-8 h-8 text-cyan-400" />
                </motion.div>
                
                {/* Secondary radar dots */}
                <div className="absolute w-2 h-2 rounded-full bg-cyan-400 top-0 left-1/2 -translate-x-1/2 shadow-lg shadow-cyan-500" />
              </div>

              {/* Title Header */}
              <div className="space-y-1">
                <h1 className="font-display text-2xl font-bold tracking-widest text-white uppercase text-glow">
                  PORTAFOLIO ESPACIAL
                </h1>
                <p className="font-mono text-[9px] text-cyan-400 tracking-widest uppercase">
                  Sonda de Exploración de Armando Monreal
                </p>
              </div>

              {/* Loading Bar Progress Section */}
              <div className="space-y-2 bg-slate-950/80 border border-slate-900 rounded-xl p-4 shadow-2xl">
                <div className="flex justify-between items-center font-mono text-[10px] text-slate-400">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Terminal className="w-3 h-3 animate-pulse" /> {warpStatusText}
                  </span>
                  <span className="font-bold text-white">{warpProgress}%</span>
                </div>

                {/* Progress bar line */}
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-lg shadow-cyan-500"
                    style={{ width: `${warpProgress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>

                <div className="flex justify-between items-center pt-2 font-mono text-[8px] text-slate-500 border-t border-slate-900/60">
                  <span>VELOCIDAD: HIPERDRIVE x3.5</span>
                  <span>ESTADO: CALIBRANDO COORDENADAS</span>
                </div>
              </div>

              {/* Skip sequence button */}
              <button
                onClick={() => setAppState("solar_system")}
                className="inline-flex items-center gap-1.5 text-[10px] font-mono text-slate-500 hover:text-slate-200 transition-all cursor-pointer border border-slate-900 hover:border-slate-800 bg-slate-950/40 px-3 py-1.5 rounded-lg"
              >
                Omitir secuencia de despegue <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= PHASE 3: ACTIVE SOLAR SYSTEM DECK ================= */}
      {appState === "solar_system" && (
        <div className="relative min-h-screen z-20 flex flex-col justify-between p-4 md:p-6 select-none">
          
          {/* ================= CORE HEADER HUD PANELS ================= */}
          <header className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full z-30 pointer-events-none">
            
            {/* Upper Left: Developer Telemetry HUD */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-slate-950/80 backdrop-blur-md border border-slate-900 rounded-2xl p-4 flex items-center gap-4 w-full md:w-auto shadow-2xl pointer-events-auto shadow-black/80"
            >
              {/* Glowing holographic radar dot */}
              <div className="relative w-12 h-12 rounded-full border border-cyan-500/30 bg-cyan-950/10 flex items-center justify-center flex-shrink-0">
                <Rocket className="w-5 h-5 text-cyan-400" />
                <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping opacity-35" />
              </div>

              <div className="font-mono text-left">
                <h2 className="font-display text-sm font-bold text-white tracking-wide uppercase">
                  Armando Monreal
                </h2>
                <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Órbita de Proyectos Activa</span>
                </div>
                <div className="text-[9px] text-slate-500 uppercase mt-1 flex flex-wrap gap-x-2">
                  <span>S.O. Kepler-09</span>
                  <span>|</span>
                  <span>STARDATE: {starDate}</span>
                </div>
              </div>
            </motion.div>

            {/* Upper Right: Navigation Deck (Buttons) */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-2 w-full md:w-auto justify-end pointer-events-auto"
            >
              {/* Open Captain's Log (About Panel) */}
              <button
                onClick={() => setIsAboutOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-900 hover:border-blue-500/25 bg-slate-950/85 backdrop-blur-md text-slate-300 hover:text-white transition-all shadow-lg text-xs font-semibold cursor-pointer font-display"
              >
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>Bitácora (Sobre Mí)</span>
              </button>

              {/* Open Transmit Signal (Contact Form) */}
              <button
                onClick={() => setIsContactOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-500/35 hover:border-blue-500/60 bg-blue-950/10 hover:bg-blue-950/20 backdrop-blur-md text-blue-300 hover:text-blue-100 transition-all shadow-lg shadow-blue-950/30 text-xs font-semibold cursor-pointer font-display"
              >
                <Radio className="w-4 h-4 text-blue-400 animate-pulse" />
                <span>Transmitir Señal</span>
              </button>
            </motion.div>
          </header>

          {/* ================= MAIN INTERACTIVE STELLAR STAGE ================= */}
          <main
            className="absolute inset-0 flex items-center justify-center z-10 p-4 cursor-grab active:cursor-grabbing overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            
            {/* The Solar System Orbital Container (Animated with pan translation!) */}
            <motion.div
              animate={{ x: pan.x, y: pan.y }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="relative w-full max-w-lg aspect-square flex items-center justify-center pointer-events-auto"
            >
              
              {/* CENTRAL SUN: Developer Core Hub */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center cursor-pointer z-20 group"
                onClick={() => {
                  if (draggedDistance < 8) {
                    setIsAboutOpen(true);
                  }
                }}
              >
                {/* Visual Sun Gradients & Atmosphere Rings */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-600 via-cyan-400 to-white glow-cyan shadow-cyan-500/40 border border-cyan-300/40" />
                <div className="absolute inset-[-12px] rounded-full bg-cyan-400/10 blur-[15px] pointer-events-none group-hover:bg-cyan-400/20 transition-all" />
                <div className="absolute inset-[-24px] rounded-full bg-cyan-500/5 blur-[35px] pointer-events-none group-hover:opacity-100 opacity-60 transition-all animate-pulse" />

                {/* Orbit Core SVG rotation ring around the Sun */}
                <svg className="absolute w-[120%] h-[120%] pointer-events-none opacity-40 group-hover:opacity-85 transition-opacity" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="47"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="0.75"
                    strokeDasharray="4 8"
                    className="animate-spin"
                    style={{ animationDuration: "16s" }}
                  />
                </svg>

                {/* Developer Core Content */}
                <div className="relative flex flex-col items-center justify-center text-center p-2">
                  <Cpu className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
                  <span className="font-display text-[8px] md:text-[10px] text-slate-950 font-bold tracking-widest mt-1 uppercase">
                    COSMOS CORE
                  </span>
                  <span className="font-mono text-[7px] text-slate-900 leading-none">
                    JOSÉ_A
                  </span>
                </div>

                {/* Little solar wind rays */}
                <div className="absolute w-1 h-3 bg-white/40 -top-1 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="absolute w-1 h-3 bg-white/40 -bottom-1 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="absolute w-3 h-1 bg-white/40 -left-1 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="absolute w-3 h-1 bg-white/40 -right-1 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
              </motion.div>

              {/* RENDER ORBITING PLANETS */}
              {scaledProjects.map((project, idx) => (
                <Planet
                  key={project.id}
                  project={project}
                  time={time}
                  orbitSpeedFactor={orbitSpeedFactor}
                  showOrbits={showOrbits}
                  isPaused={isPaused}
                  isSelected={selectedProject?.id === project.id}
                  onClick={() => {
                    if (draggedDistance < 8) {
                      setSelectedProject(project);
                      setActivePlanetIndex(idx);
                    }
                  }}
                />
              ))}
            </motion.div>
          </main>

          {/* ================= INTERACTIVE HUD DETAILS (LEFT/RIGHT SIDERS) ================= */}
          <div className="relative flex justify-between items-end w-full pointer-events-none z-20 mt-auto mb-16 md:mb-0">
            
            {/* Left Sidebar: Star Radar list of sectors */}
            <motion.div
              initial={{ x: -25, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="hidden lg:flex flex-col gap-3 bg-slate-950/70 border border-slate-900 rounded-2xl p-4 w-60 pointer-events-auto shadow-2xl backdrop-blur-md shadow-black/60"
            >
              <div className="flex items-center gap-1.5 border-b border-slate-900 pb-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span className="font-display text-[10px] font-bold tracking-wider text-slate-200 uppercase">
                  Radar de Sectores
                </span>
              </div>

              <div className="space-y-1.5 text-left">
                {scaledProjects.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProject(p);
                      setActivePlanetIndex(idx);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl border text-left transition-all group cursor-pointer ${
                      selectedProject?.id === p.id
                        ? "bg-cyan-500/5 border-cyan-500/25 text-white"
                        : "bg-slate-950 border-slate-950 hover:bg-slate-900/40 hover:border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {/* Little color indicator */}
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 bg-${p.colorClass}-500 shadow shadow-${p.colorClass}-500/40`} />
                      <div className="overflow-hidden">
                        <p className="font-display text-[11px] font-bold tracking-tight truncate group-hover:text-white">
                          {p.title}
                        </p>
                        <p className="font-mono text-[8px] text-slate-500 truncate uppercase">
                          Sect: {p.name}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Right Sidebar: Quick Help Desk */}
            <motion.div
              initial={{ x: 25, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="hidden md:flex flex-col gap-3 bg-slate-950/70 border border-slate-900 rounded-2xl p-4 w-52 pointer-events-auto shadow-2xl backdrop-blur-md shadow-black/60 text-left font-mono text-[9px] text-slate-400 leading-normal"
            >
              <div className="flex items-center gap-1.5 border-b border-slate-900 pb-2 text-slate-200 font-display text-[10px] font-bold uppercase tracking-wider">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Instrucciones de Órbita</span>
              </div>
              <ul className="space-y-2 list-none pl-0">
                <li className="flex gap-1.5">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Haz clic en los <strong>planetas</strong> para explorar los proyectos de Armando.</span>
                </li>
                <li className="flex gap-1.5">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Modula la velocidad orbital usando la <strong>consola de comandos</strong> de navegación abajo.</span>
                </li>
                <li className="flex gap-1.5">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Habilita el <strong>Piloto Automático</strong> para dar un tour guiado a través de los sectores.</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* ================= FLOOR NAVIGATION CONTROL DECK CONSOLE ================= */}
          <footer className="relative flex justify-center w-full z-30 pointer-events-none mt-4">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-slate-950/90 border border-slate-900 rounded-2xl p-3 md:p-4 flex flex-col md:flex-row items-center justify-between gap-4 w-full max-w-4xl shadow-2xl pointer-events-auto backdrop-blur-md shadow-black/80"
            >
              {/* Left Console Section: Simulation Player Controls */}
              <div className="flex items-center gap-2">
                <div className="font-mono text-[9px] text-slate-400 border-r border-slate-900 pr-3 mr-1.5 py-1 uppercase tracking-widest hidden sm:block">
                  SISTEMA DE ÓRBITAS:
                </div>

                {/* Play / Pause */}
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold cursor-pointer transition-all ${
                    isPaused
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                      : "border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800"
                  }`}
                  title={isPaused ? "Reanudar Simulación" : "Pausar Simulación"}
                >
                  {isPaused ? <Play className="w-3 h-3 text-amber-400" /> : <Pause className="w-3 h-3" />}
                  <span>{isPaused ? "REANUDAR" : "PAUSAR"}</span>
                </button>

                {/* Cruise Speed (1x) */}
                <button
                  onClick={() => {
                    setIsPaused(false);
                    setOrbitSpeedFactor(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold cursor-pointer transition-all ${
                    !isPaused && orbitSpeedFactor === 1
                      ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  CRUCERO (1x)
                </button>

                {/* Hyperdrive Speed (3x) */}
                <button
                  onClick={() => {
                    setIsPaused(false);
                    setOrbitSpeedFactor(3);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold cursor-pointer transition-all ${
                    !isPaused && orbitSpeedFactor === 3
                      ? "border-pink-500/30 bg-pink-500/10 text-pink-300"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  HIPERDRIVE (3x)
                </button>
              </div>

              {/* Middle Console Section: Star Warp triggering again */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleWarpOverride}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/35 hover:border-cyan-500/60 bg-cyan-950/15 hover:bg-cyan-950/30 text-cyan-400 hover:text-cyan-300 transition-all font-mono text-[10px] font-bold cursor-pointer"
                  title="Ejecutar salto hiperlumínico"
                >
                  <Rocket className="w-3 h-3 animate-pulse" />
                  <span>EFECTUAR WARP</span>
                </button>

              </div>

              {/* Right Console Section: Visibility options */}
              <div className="flex items-center gap-3">
                
                {/* Autopilot toggle */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="font-mono text-[9px] text-slate-400 uppercase">
                    Tour Piloto:
                  </span>
                  <button
                    onClick={() => setAutopilot(!autopilot)}
                    className={`relative w-8 h-4.5 rounded-full border transition-colors ${
                      autopilot ? "bg-cyan-500/20 border-cyan-500/40" : "bg-slate-900 border-slate-800"
                    }`}
                  >
                    <motion.span
                      className={`absolute top-[2.5px] left-[3px] w-3 h-3 rounded-full ${
                        autopilot ? "bg-cyan-400" : "bg-slate-600"
                      }`}
                      animate={{ x: autopilot ? 12 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  </button>
                </label>

                {/* Orbit trails toggle */}
                <button
                  onClick={() => setShowOrbits(!showOrbits)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold cursor-pointer transition-all ${
                    showOrbits
                      ? "border-slate-700 bg-slate-900/40 text-slate-300"
                      : "border-slate-900 bg-slate-950 text-slate-600"
                  }`}
                >
                  {showOrbits ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span className="hidden sm:inline">TRAZAR ORBITAS</span>
                </button>
              </div>
            </motion.div>
          </footer>

          {/* Floating Navigation Reset Button */}
          <AnimatePresence>
            {(pan.x !== 0 || pan.y !== 0) && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPan({ x: 0, y: 0 })}
                className="absolute bottom-20 right-6 md:bottom-24 md:right-8 z-40 bg-slate-950/80 border border-cyan-500/30 hover:border-cyan-400 rounded-xl px-3 py-2 flex items-center gap-2 font-mono text-[10px] text-cyan-400 hover:text-cyan-300 shadow-xl shadow-black/80 pointer-events-auto cursor-pointer"
              >
                <Compass className="w-4 h-4 animate-pulse text-cyan-400" />
                <span>REESTABLECER NAVEGACIÓN</span>
              </motion.button>
            )}
          </AnimatePresence>

        </div>
      )}

      {/* ================= MODAL & SIDEBAR OVERLAYS ================= */}
      
      {/* Project Details Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => {
          setSelectedProject(null);
          setActivePlanetIndex(null);
          // Turn off autopilot if manually closed
          if (autopilot) setAutopilot(false);
        }}
      />

      {/* About Panel (Bitácora de Vuelo) */}
      <AboutPanel
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onOpenContact={() => {
          setIsAboutOpen(false);
          setIsContactOpen(true);
        }}
      />

      {/* Contact Modal (Transmit Signal) */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

    </div>
  );
}
