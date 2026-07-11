import { motion, AnimatePresence } from "motion/react";
import { X, Radio, Github, Mail, ExternalLink } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 select-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/85 cursor-pointer"
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg rounded-2xl bg-slate-950 border border-blue-500/30 text-slate-100 p-6 md:p-8 shadow-2xl shadow-blue-500/10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f608_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none rounded-2xl" />

          <div className="relative flex justify-between items-start pb-5 border-b border-slate-900">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-blue-400 tracking-widest uppercase mb-1">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Canal de contacto</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white">Transmitir señal</h3>
              <p className="font-sans text-xs text-slate-400 mt-1">
                Ponte en contacto con Armando Monreal.
              </p>
            </div>

            <button
              onClick={onClose}
              aria-label="Cerrar contacto"
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative space-y-3 py-6">
            <a
              href="https://github.com/ElMandinho777"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-blue-500/40 hover:bg-blue-950/20 p-4 transition-all group"
            >
              <div className="w-11 h-11 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Github className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider block">GitHub</span>
                <span className="font-display text-sm font-semibold text-slate-200 group-hover:text-white">@ElMandinho777</span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
            </a>

            <div className="flex items-center gap-4 rounded-xl border border-slate-900 bg-slate-900/20 p-4">
              <div className="w-11 h-11 rounded-lg bg-slate-800/50 border border-slate-800 flex items-center justify-center">
                <Mail className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider block">Correo electrónico</span>
                <span className="font-display text-sm font-semibold text-slate-400">Próximamente</span>
              </div>
            </div>
          </div>

          <div className="relative pt-4 border-t border-slate-900 font-mono text-[9px] text-slate-500 text-center uppercase tracking-widest">
            Canal profesional de Armando Monreal
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
