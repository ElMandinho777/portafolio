import { useState } from "react";
import { Project } from "../types";
import { motion } from "motion/react";

interface PlanetProps {
  key?: string;
  project: Project;
  time: number;
  orbitSpeedFactor: number;
  showOrbits: boolean;
  isPaused: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export default function Planet({
  project,
  time,
  orbitSpeedFactor,
  showOrbits,
  isPaused,
  isSelected,
  onClick,
}: PlanetProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate dynamic angle: offset + (time * speedFactor) / orbitSpeed
  // If paused, we don't increment time, so they stay in place.
  const angle = project.angleOffset + (time * orbitSpeedFactor) / project.orbitSpeed;
  const x = Math.cos(angle) * project.orbitRadius;
  const y = Math.sin(angle) * project.orbitRadius;

  // Color mapping for gradient styles with solid hex fallback for accurate canvas/gradient render
  const colorMap: Record<string, { sphere: string; glow: string; text: string; ring: string; hex: string }> = {
    amber: {
      sphere: "from-amber-300 via-amber-500 to-amber-950 border-amber-400/40",
      glow: "glow-amber",
      text: "text-amber-400",
      ring: "border-amber-500/20 bg-amber-500/5",
      hex: "#f59e0b",
    },
    cyan: {
      sphere: "from-cyan-300 via-cyan-500 to-cyan-950 border-cyan-400/40",
      glow: "glow-cyan",
      text: "text-cyan-400",
      ring: "border-cyan-500/20 bg-cyan-500/5",
      hex: "#06b6d4",
    },
    purple: {
      sphere: "from-purple-300 via-purple-500 to-purple-950 border-purple-400/40",
      glow: "glow-purple",
      text: "text-purple-400",
      ring: "border-purple-500/20 bg-purple-500/5",
      hex: "#a855f7",
    },
    emerald: {
      sphere: "from-emerald-300 via-emerald-500 to-emerald-950 border-emerald-400/40",
      glow: "glow-emerald",
      text: "text-emerald-400",
      ring: "border-emerald-500/20 bg-emerald-500/5",
      hex: "#10b981",
    },
    pink: {
      sphere: "from-pink-300 via-pink-500 to-pink-950 border-pink-400/40",
      glow: "glow-pink",
      text: "text-pink-400",
      ring: "border-pink-500/20 bg-pink-500/5",
      hex: "#ec4899",
    },
  };

  const style = colorMap[project.colorClass] || colorMap.cyan;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Orbit Trail */}
      {showOrbits && (
        <div
          className={`absolute border rounded-full pointer-events-none transition-colors duration-500 ${
            isHovered
              ? "border-slate-400/35 shadow-[0_0_15px_rgba(255,255,255,0.04)]"
              : "border-slate-800/45"
          }`}
          style={{
            width: project.orbitRadius * 2,
            height: project.orbitRadius * 2,
          }}
        />
      )}

      {/* Orbiting Planet Body */}
      <motion.div
        className="absolute pointer-events-auto cursor-pointer group z-10"
        style={{
          x,
          y,
        }}
        whileHover={{ scale: 1.15 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* Planet Sphere & Rings Wrapper */}
        <div className="relative flex items-center justify-center" style={{ width: project.size + 24, height: project.size + 24 }}>
          
          {/* Planet Label (displayed on hover or if selected) */}
          <div className="absolute bottom-full mb-3 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 bg-black/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-800/80 pointer-events-none whitespace-nowrap shadow-xl shadow-black/90 z-30">
            <span className={`font-display text-[12px] font-bold ${style.text} tracking-wide`}>
              {project.name}
            </span>
            <span className="font-sans text-[10px] text-slate-300 font-medium mt-0.5">
              {project.title}
            </span>
          </div>

          {/* Aesthetic Coordinate Radar Line on Hover */}
          <div className="absolute h-[1px] bg-gradient-to-r from-transparent to-slate-600/40 w-64 origin-left -rotate-45 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-300" style={{ left: project.size / 2 }} />

          {/* Planet Moons with orbital path lines */}
          {project.stats.moons > 0 && (
            <>
              {/* Moon Orbit line */}
              <div 
                className="absolute border border-slate-800/25 rounded-full pointer-events-none"
                style={{
                  width: (project.size / 2 + 10) * 2,
                  height: (project.size / 2 + 10) * 2,
                }}
              />
              {/* Moon Body */}
              <div 
                className="absolute rounded-full bg-gradient-to-br from-slate-200 via-slate-400 to-slate-700 border border-slate-600/20 shadow-md"
                style={{
                  width: 6,
                  height: 6,
                  transform: `rotate(${time * 1.4}rad) translate(${project.size / 2 + 10}px)`,
                }}
              >
                {/* 3D shadow overlay for the tiny moon */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,transparent_40%,rgba(0,0,0,0.85)_90%)] rounded-full" />
              </div>

              {/* Second tiny moon on wider orbit if the planet has 3 or more moons */}
              {project.stats.moons >= 3 && (
                <>
                  <div 
                    className="absolute border border-slate-800/15 rounded-full pointer-events-none"
                    style={{
                      width: (project.size / 2 + 18) * 2,
                      height: (project.size / 2 + 18) * 2,
                    }}
                  />
                  <div 
                    className="absolute rounded-full bg-gradient-to-br from-slate-300 via-slate-500 to-slate-800 border border-slate-700/20 shadow-sm"
                    style={{
                      width: 4.5,
                      height: 4.5,
                      transform: `rotate(${time * -0.95 + 2.2}rad) translate(${project.size / 2 + 18}px)`,
                    }}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,transparent_40%,rgba(0,0,0,0.85)_90%)] rounded-full" />
                  </div>
                </>
              )}
            </>
          )}

          {/* Planet Ring System for Aegis-9 (p2 Gas Giant) */}
          {project.id === "p2" && (
            <>
              {/* Inner ring */}
              <div
                className="absolute rounded-full border border-cyan-500/20 pointer-events-none transform -rotate-[15deg]"
                style={{
                  width: project.size * 1.4,
                  height: project.size * 0.35,
                }}
              />
              {/* Main glowing ring */}
              <div
                className={`absolute rounded-full border-[5px] border-double opacity-85 pointer-events-none transform -rotate-[15deg] ${style.ring}`}
                style={{
                  width: project.size * 1.9,
                  height: project.size * 0.48,
                }}
              />
              {/* Outer faint dust ring */}
              <div
                className="absolute rounded-full border border-dashed border-cyan-400/25 pointer-events-none transform -rotate-[15deg]"
                style={{
                  width: project.size * 2.2,
                  height: project.size * 0.55,
                }}
              />
            </>
          )}

          {/* Planet Ring for Vespera (p3 Crystal Dust Ring) */}
          {project.id === "p3" && (
            <div
              className={`absolute rounded-full border border-dashed opacity-65 pointer-events-none transform rotate-[25deg] ${style.ring}`}
              style={{
                width: project.size * 1.62,
                height: project.size * 0.36,
              }}
            />
          )}

          {/* Main Planet Sphere */}
          <div
            className={`rounded-full bg-gradient-to-br ${style.sphere} border ${project.glowColor} transition-all duration-300 relative overflow-hidden`}
            style={{
              width: project.size,
              height: project.size,
            }}
          >
            {/* Planet-specific High-Fidelity Custom Surface Textures */}
            {project.id === "p1" && (
              /* Kepler-452b: Rocky continents & craters */
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-80">
                {/* Continental landmass 1 */}
                <div className="absolute top-1 left-2 w-7 h-5 rounded-full bg-gradient-to-br from-amber-600/50 to-yellow-700/40 blur-[1px] transform rotate-12" />
                {/* Continental landmass 2 */}
                <div className="absolute bottom-2 right-1 w-6 h-4 rounded-full bg-gradient-to-br from-yellow-600/40 to-amber-800/50 blur-[1px] transform -rotate-45" />
                {/* Crater 1 */}
                <div className="absolute top-5 right-3 w-2.5 h-2 rounded-full border border-black/40 bg-amber-950/40 shadow-inner" />
                {/* Crater 2 */}
                <div className="absolute bottom-3 left-4 w-1.5 h-1.5 rounded-full border border-black/30 bg-amber-950/30 shadow-inner" />
              </div>
            )}

            {project.id === "p2" && (
              /* Aegis-9: Gas giant atmospheric band structures & storm spot */
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-90">
                {/* Gas bands with different opacities */}
                <div className="absolute top-[20%] inset-x-0 h-[6px] bg-cyan-300/25 blur-[0.5px]" />
                <div className="absolute top-[35%] inset-x-0 h-[4px] bg-cyan-700/40 blur-[0.5px]" />
                <div className="absolute top-[55%] inset-x-0 h-[8px] bg-cyan-200/30 blur-[0.5px]" />
                <div className="absolute top-[70%] inset-x-0 h-[5px] bg-cyan-900/60 blur-[0.5px]" />
                {/* Great Storm Spot */}
                <div className="absolute bottom-3 right-4 w-3.5 h-2 rounded-full bg-cyan-200/80 border border-cyan-400/50 shadow-md shadow-cyan-400/40 animate-pulse" />
              </div>
            )}

            {project.id === "p3" && (
              /* Vespera: Crystalline structures & bio-luminescent sparkles */
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-85">
                {/* Facets */}
                <div className="absolute top-1 left-3 w-5 h-5 bg-purple-300/30 rounded-br-lg rotate-12 filter blur-[0.5px]" />
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-purple-400/20 rounded-tl-lg -rotate-45 filter blur-[0.5px]" />
                {/* Shimmering crystals */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-purple-200/80 rotate-45 animate-shimmer-crystal shadow-[0_0_8px_rgba(216,180,254,1)]" />
                <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-pink-300/90 rotate-45 animate-shimmer-crystal" />
              </div>
            )}

            {project.id === "p4" && (
              /* Zephyrus: Turbulent swirling wind streams */
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-85">
                {/* Turbulent wind bands */}
                <div className="absolute top-[15%] left-[-20%] w-[140%] h-[5px] bg-emerald-300/30 rounded-full animate-swirl-wind" />
                <div className="absolute top-[40%] left-[-10%] w-[120%] h-[7px] bg-emerald-200/20 rounded-full animate-swirl-wind" style={{ animationDelay: "1.5s" }} />
                <div className="absolute top-[65%] left-[-30%] w-[150%] h-[4px] bg-emerald-400/25 rounded-full animate-swirl-wind" style={{ animationDelay: "3s" }} />
                
                {/* Storm vortexes */}
                <div className="absolute top-2 right-5 w-2.5 h-1.5 rounded-full border border-emerald-300/40 bg-emerald-900/40 animate-spin" style={{ animationDuration: "10s" }} />
                <div className="absolute bottom-3 left-6 w-2 h-2 rounded-full border border-emerald-400/30 bg-emerald-950/30 animate-spin" style={{ animationDuration: "6s" }} />
              </div>
            )}

            {project.id === "p5" && (
              /* Helios Prime: Molten lava cracks & solar flares */
              <div className="absolute inset-0 overflow-hidden pointer-events-none animate-molten-lava">
                {/* Heat core gradients */}
                <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-[radial-gradient(circle,rgba(252,211,77,0.85)_0%,transparent_70%)] blur-[2px] opacity-75" />
                <div className="absolute bottom-1 right-2 w-6 h-6 rounded-full bg-[radial-gradient(circle,rgba(239,68,68,0.9)_0%,transparent_70%)] blur-[1.5px] opacity-80" />
                {/* Molten crack lines */}
                <div className="absolute inset-x-0 top-1/2 h-[3px] bg-amber-300 -rotate-12 blur-[0.5px] opacity-90 shadow-[0_0_6px_#f59e0b]" />
                <div className="absolute top-3 right-4 w-3.5 h-3.5 bg-rose-400 rounded-full blur-[1px] animate-ping" style={{ animationDuration: "3.5s" }} />
              </div>
            )}

            {/* 3D Surface Shadow overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,transparent_30%,rgba(0,0,0,0.85)_82%)] rounded-full pointer-events-none" />
            
            {/* Fine atmosphere rings for all planets to ensure visual consistency */}
            <div className="absolute inset-x-0 h-[1.5px] bg-white/10 top-[30%] -rotate-6" />
            <div className="absolute inset-x-0 h-[1px] bg-black/25 top-[60%] -rotate-6" />
          </div>

          {/* Planet Atmosphere Glow Highlight */}
          <div
            className="absolute rounded-full blur-[14px] opacity-45 mix-blend-screen pointer-events-none transition-all duration-300 group-hover:opacity-80 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            style={{
              width: project.size * 1.5,
              height: project.size * 1.5,
              background: `radial-gradient(circle, ${style.hex} 0%, transparent 70%)`
            }}
          />

          {/* Selection indicator ring */}
          {isSelected && (
            <motion.div
              layoutId="planet-select-ring"
              className={`absolute rounded-full border-2 border-dashed ${style.text} opacity-85`}
              style={{
                width: project.size + 18,
                height: project.size + 18,
              }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}
