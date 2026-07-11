import { Project } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, Github, Compass, Shield, Orbit, Activity, Cpu } from "lucide-react";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  // Colors config based on the planet's theme
  const themeMap: Record<string, {
    accent: string;
    bg: string;
    border: string;
    badge: string;
    glow: string;
    textGlow: string;
    iconColor: string;
  }> = {
    amber: {
      accent: "text-amber-400",
      bg: "bg-amber-950/10",
      border: "border-amber-500/30",
      badge: "bg-amber-500/10 text-amber-300 border-amber-500/20",
      glow: "shadow-amber-500/10",
      textGlow: "text-glow-cyan", // fallback
      iconColor: "text-amber-500",
    },
    cyan: {
      accent: "text-cyan-400",
      bg: "bg-cyan-950/10",
      border: "border-cyan-500/30",
      badge: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
      glow: "shadow-cyan-500/10",
      textGlow: "text-glow-cyan",
      iconColor: "text-cyan-500",
    },
    purple: {
      accent: "text-purple-400",
      bg: "bg-purple-950/10",
      border: "border-purple-500/30",
      badge: "bg-purple-500/10 text-purple-300 border-purple-500/20",
      glow: "shadow-purple-500/10",
      textGlow: "text-glow-purple",
      iconColor: "text-purple-500",
    },
    emerald: {
      accent: "text-emerald-400",
      bg: "bg-emerald-950/10",
      border: "border-emerald-500/30",
      badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
      glow: "shadow-emerald-500/10",
      textGlow: "text-glow-cyan",
      iconColor: "text-emerald-500",
    },
    pink: {
      accent: "text-pink-400",
      bg: "bg-pink-950/10",
      border: "border-pink-500/30",
      badge: "bg-pink-500/10 text-pink-300 border-pink-500/20",
      glow: "shadow-pink-500/10",
      textGlow: "text-glow-purple",
      iconColor: "text-pink-500",
    },
  };

  const theme = themeMap[project.colorClass] || themeMap.cyan;

  // Render a simulated live status indicator
  const getStatusBadge = (status: Project["stats"]["status"]) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ACTIVO
          </span>
        );
      case "Developing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            EN DESARROLLO
          </span>
        );
      case "Archived":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            ARCHIVADO
          </span>
        );
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 select-none">
        {/* Dark overlay backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/85 cursor-pointer"
          onClick={onClose}
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
          className={`relative w-full max-w-3xl rounded-2xl bg-slate-950 border ${theme.border} text-slate-100 p-6 md:p-8 shadow-2xl overflow-hidden pointer-events-auto max-h-[90vh] flex flex-col ${theme.glow}`}
        >
          {/* Subtle grid background accent */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

          {/* Glowing gradient back-accent */}
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-5 pointer-events-none" style={{ background: `radial-gradient(circle, var(--color-${project.colorClass}-500) 0%, transparent 75%)` }} />

          {/* Modal Header */}
          <div className="relative flex justify-between items-start mb-6 z-10">
            <div>
              {/* Planetary coordinates / stardate */}
              <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400 tracking-widest uppercase mb-1">
                <Compass className="w-3.5 h-3.5" />
                <span>Sector {project.name}</span>
                <span>•</span>
                <span>Clase: {project.stats.class}</span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight mt-1 text-white">
                {project.title}
              </h3>
              <p className={`font-sans text-xs md:text-sm ${theme.accent} font-medium mt-1`}>
                {project.tagline}
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:text-white transition-all text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="about-scroll relative flex-1 min-h-0 overflow-y-auto overscroll-contain z-10 space-y-6 pr-2 [scrollbar-gutter:stable] [touch-action:pan-y]">
            
            {/* Tech Stats Bento-grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/40 border border-slate-900 rounded-xl p-4">
              <div className="flex flex-col">
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Orbit className="w-3 h-3 text-slate-400" /> Distancia
                </span>
                <span className="font-mono text-sm font-semibold text-slate-200 mt-0.5">
                  {project.stats.distance}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Shield className="w-3 h-3 text-slate-400" /> Módulos / Lunas
                </span>
                <span className="font-mono text-sm font-semibold text-slate-200 mt-0.5">
                  {project.stats.moons} {project.stats.moons === 1 ? "luna" : "lunas"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Activity className="w-3 h-3 text-slate-400" /> Estado
                </span>
                <span className="mt-0.5">
                  {getStatusBadge(project.stats.status)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-slate-400" /> Núcleo
                </span>
                <span className="font-mono text-sm font-semibold text-slate-200 mt-0.5">
                  ST-OS
                </span>
              </div>
            </div>

            {/* Project Overview */}
            <div className="space-y-2">
              <h4 className="font-display text-sm font-semibold text-slate-200 uppercase tracking-wider">
                Descripción de la Bitácora
              </h4>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-sans">
                {project.description}
              </p>
            </div>

            {/* Technologies */}
            <div className="space-y-2.5">
              <h4 className="font-display text-sm font-semibold text-slate-200 uppercase tracking-wider">
                Materiales e Infraestructura (Tech Stack)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className={`font-mono text-[11px] px-2.5 py-1 rounded-md border ${theme.badge}`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Features */}
            <div className="space-y-3">
              <h4 className="font-display text-sm font-semibold text-slate-200 uppercase tracking-wider">
                Funcionalidades de la Sonda
              </h4>
              <ul className="space-y-2">
                {project.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-300">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 bg-${project.colorClass}-400 flex-shrink-0`} />
                    <span className="font-sans leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Footer */}
          <div className="relative flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-slate-900 z-10 bg-slate-950/30">
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noreferrer"
                className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-display text-xs md:text-sm font-semibold tracking-wide bg-${project.colorClass}-500 hover:bg-${project.colorClass}-400 text-slate-950 transition-all shadow-lg hover:shadow-${project.colorClass}-500/20`}
                style={{
                  backgroundColor: `var(--color-${project.colorClass}-500)`,
                  color: "#030303"
                }}
              >
                <ExternalLink className="w-4 h-4" />
                <span>Iniciar Transmisión (Ver Demo)</span>
              </a>
            )}
            
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-display text-xs md:text-sm font-semibold tracking-wide border border-slate-800 bg-slate-900/40 hover:bg-slate-800 hover:text-white transition-all text-slate-300"
            >
              <Github className="w-4 h-4" />
              <span>Ver perfil en GitHub</span>
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
