import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, BookOpen, Cpu, Shield, History, Radio } from "lucide-react";
import { captainLogs } from "../projectsData";

interface AboutPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact: () => void;
}

export default function AboutPanel({ isOpen, onClose, onOpenContact }: AboutPanelProps) {
  const [activeTab, setActiveTab] = useState<"bio" | "skills" | "missions">("bio");

  if (!isOpen) return null;

  // Space skills list with custom chemical/celestial descriptions
  const skills = [
    { name: "HTML5 / JavaScript", category: "Fundamentos Frontend", level: "Núcleo Web", icon: "🌐", percent: 90 },
    { name: "React / Vite", category: "Front-end", level: "Interfaces Dinámicas", icon: "⚛️", percent: 90 },
    { name: "TypeScript / Tailwind", category: "Código y Diseño", level: "Sistemas Tipados", icon: "🎨", percent: 85 },
    { name: "Node.js / Express", category: "Backend", level: "Servicios REST", icon: "⚡", percent: 82 },
    { name: "MySQL / MongoDB / Firebase", category: "Bases de Datos", level: "Persistencia Multinúcleo", icon: "💾", percent: 80 },
    { name: "Git / GitHub", category: "Herramientas", level: "Control de Misión", icon: "🔗", percent: 85 },
    { name: "IoT / Raspberry Pi", category: "Hardware y Software", level: "Sistemas Conectados", icon: "🛰️", percent: 75 },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-y-0 right-0 z-40 w-full max-w-lg md:max-w-xl pointer-events-none select-none flex justify-end">
        {/* Semi-transparent dark background cover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 pointer-events-auto cursor-pointer"
          onClick={onClose}
        />

        {/* Floating holographic sidebar deck */}
        <motion.div
          initial={{ x: "100%", opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0.5 }}
          transition={{ type: "spring", damping: 28, stiffness: 220 }}
          className="relative h-full w-full bg-slate-950 border-l border-slate-900 text-slate-100 p-6 md:p-8 flex flex-col pointer-events-auto shadow-2xl z-50 max-w-[90vw]"
        >
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

          {/* Glowing planetary highlight */}
          <div className="absolute top-1/3 -left-20 w-48 h-48 rounded-full bg-blue-500/5 blur-[80px] pointer-events-none" />

          {/* Header */}
          <div className="relative flex justify-between items-center pb-5 border-b border-slate-900 z-10">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="font-display text-lg md:text-xl font-bold tracking-tight text-white uppercase">
                  Bitácora de Vuelo
                </h3>
                <p className="font-mono text-[9px] text-blue-400 tracking-wider">
                  SISTEMA DE ARCHIVOS PRINCIPALES
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-900 bg-slate-900/40 hover:bg-slate-800 hover:text-white transition-all text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className="relative flex gap-1 bg-slate-950 border border-slate-900 p-1 rounded-lg my-5 z-10 font-display">
            <button
              onClick={() => setActiveTab("bio")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-md transition-all ${
                activeTab === "bio"
                  ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Capitán</span>
            </button>
            
            <button
              onClick={() => setActiveTab("skills")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-md transition-all ${
                activeTab === "skills"
                  ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Energías</span>
            </button>

            <button
              onClick={() => setActiveTab("missions")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-md transition-all ${
                activeTab === "missions"
                  ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Misiones</span>
            </button>
          </div>

          {/* Tab Content (Scrollable) */}
          <div className="about-scroll relative flex-1 min-h-0 overflow-y-auto overscroll-contain pr-2 z-10 space-y-6 [scrollbar-gutter:stable] [touch-action:pan-y]">
            
            {/* Tab 1: Bio */}
            {activeTab === "bio" && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                {/* Holographic Avatar Mock */}
                <div className="flex items-center gap-4 bg-slate-900/40 border border-slate-900/80 p-4 rounded-xl">
                  <div className="relative w-16 h-16 rounded-full border-2 border-blue-500/30 flex items-center justify-center bg-blue-950/20">
                    <span className="text-3xl">🧑‍🚀</span>
                    <div className="absolute inset-0 rounded-full border border-blue-400/40 animate-ping opacity-20 pointer-events-none" />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-white tracking-wide">
                      ARMANDO MONREAL
                    </h4>
                    <p className="font-mono text-xs text-blue-400">
                      Desarrollador Web Full Stack
                    </p>
                    <p className="font-mono text-[9px] text-slate-500 mt-0.5 uppercase tracking-widest">
                      ESTADO: DISPONIBLE PARA NUEVAS MISIONES
                    </p>
                  </div>
                </div>

                <div className="space-y-3 font-sans text-xs md:text-sm text-slate-300 leading-relaxed">
                  <p>
                    <strong className="text-blue-400">Registro de vuelo:</strong> Soy desarrollador web apasionado por crear aplicaciones modernas, funcionales y visualmente atractivas. Me especializo en soluciones Full Stack con tecnologías actuales.
                  </p>
                  <p>
                    En cada proyecto busco ofrecer una buena experiencia de usuario, rendimiento sólido y código construido con buenas prácticas. Disfruto aprender nuevas tecnologías y resolver problemas mediante el desarrollo de software.
                  </p>
                  <p>
                    Mi objetivo es integrarme a un equipo donde pueda seguir creciendo, participar en proyectos innovadores y crear soluciones eficientes, escalables y centradas en las necesidades reales de los usuarios.
                  </p>
                </div>

                {/* Quick Info Deck */}
                <div className="grid grid-cols-2 gap-3 bg-slate-900/20 border border-slate-900 rounded-lg p-3.5 font-mono text-xs">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Combustible (Energía)</span>
                    <span className="text-slate-200 font-semibold">Disponible</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Idiomas de Sonda</span>
                    <span className="text-slate-200 font-semibold">Español nativo / Inglés intermedio</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Formación</span>
                    <span className="text-slate-200 font-semibold">TSU Graduado</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Especialidad</span>
                    <span className="text-slate-200 font-semibold">Desarrollo Full Stack</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={onOpenContact}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-display text-xs font-semibold tracking-wide shadow-lg shadow-blue-600/10 transition-all cursor-pointer"
                  >
                    <Radio className="w-4 h-4" />
                    <span>Establecer Canal de Señal (Contacto)</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Tab 2: Skills */}
            {activeTab === "skills" && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <p className="font-sans text-xs text-slate-400 leading-relaxed mb-1">
                  Tecnologías y herramientas que utilizo para construir soluciones web e integrar software con hardware:
                </p>

                <div className="space-y-4">
                  {skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/30 border border-slate-900/60 rounded-xl p-3.5 hover:border-blue-500/20 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg bg-slate-950 p-1.5 rounded-lg border border-slate-900">{skill.icon}</span>
                          <div>
                            <h5 className="font-display text-xs font-bold text-white uppercase tracking-wide">
                              {skill.name}
                            </h5>
                            <span className="font-mono text-[9px] text-slate-500">
                              {skill.category}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-[10px] text-blue-400 font-bold block">
                            {skill.level}
                          </span>
                          <span className="font-mono text-[9px] text-slate-500 block">
                            Carga: {skill.percent}%
                          </span>
                        </div>
                      </div>

                      {/* Custom loading fuel bar */}
                      <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.percent}%` }}
                          transition={{ duration: 1.2, delay: idx * 0.1 }}
                          className="h-full bg-blue-500/70"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tab 3: Missions (Experience Logs) */}
            {activeTab === "missions" && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <div className="relative border-l border-slate-800 ml-3 space-y-6 py-2">
                  {captainLogs.map((log, idx) => (
                    <div key={log.id} className="relative pl-6">
                      {/* Timeline dot */}
                      <div className="absolute left-[-4.5px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border border-slate-950 glow-blue shadow shadow-blue-500/50" />
                      
                      {/* Stardate Header */}
                      <span className="font-mono text-[10px] text-blue-400 font-semibold tracking-wider">
                        FECHA ESTELAR: {log.stardate}
                      </span>
                      
                      <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-4 mt-1.5 hover:border-slate-800 transition-all">
                        <h5 className="font-display text-xs font-bold text-white uppercase tracking-wide">
                          {log.mission}
                        </h5>
                        <p className="font-sans text-[11px] text-blue-300 font-medium mt-1">
                          {log.summary}
                        </p>
                        <p className="font-sans text-xs text-slate-400 leading-relaxed mt-2 pt-2 border-t border-slate-900/80">
                          {log.details}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer branding */}
          <div className="relative pt-4 mt-auto border-t border-slate-900 z-10 font-mono text-[9px] text-slate-500 text-center uppercase tracking-widest">
            S.O. Kepler-OS v9.5.12 • All Coordinates Verified
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
