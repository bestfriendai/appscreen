import React from 'react';
import { Sparkles, Target, Palette, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StrategyReportProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  rationale: string;
  persona: string;
  colors: string[];
}

export const StrategyReport: React.FC<StrategyReportProps> = ({ isOpen, onClose, category, rationale, persona, colors }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={onClose}>
      <div
        className="bg-surfaceHighlight border border-white/10 rounded-2xl max-w-lg w-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border-t-4 border-t-primary"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative h-32 bg-gradient-to-r from-surfaceHighlight to-black flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#202020_1px,transparent_1px),linear-gradient(to_bottom,#202020_1px,transparent_1px)] bg-[size:20px_20px] opacity-[0.2]"></div>
            <div className="absolute inset-0 bg-glow-gradient opacity-30"></div>

            <div className="text-center z-10">
                <div className="inline-flex items-center justify-center p-2 bg-primary/10 backdrop-blur-md rounded-full mb-2 border border-primary/20">
                    <Sparkles className="w-4 h-4 text-primary mr-2" />
                    <span className="text-xs font-bold text-primary uppercase tracking-wider font-mono">AI Strategy Insight</span>
                </div>
                <h2 className="text-2xl font-bold text-white font-display tracking-wide uppercase">{category}</h2>
            </div>
        </div>

        <div className="p-8 space-y-6">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary mb-1">
                    <Target className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-widest font-mono">Design Rationale</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed font-sans">
                    {rationale || "Optimizing for maximum conversion based on category benchmarks."}
                </p>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary/80 mb-1">
                    <User className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-widest font-mono">Target Persona</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed font-sans">
                    {persona || "Mobile users looking for efficiency and clarity."}
                </p>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary/60 mb-1">
                    <Palette className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-widest font-mono">Extracted Palette</h3>
                </div>
                <div className="flex gap-2">
                    {colors.map((c, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border border-white/10 shadow-lg" style={{ backgroundColor: c }} title={c}></div>
                    ))}
                </div>
            </div>

            <button
                onClick={onClose}
                className="w-full py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary/80 transition-colors mt-4 font-display tracking-wide uppercase"
            >
                Initialize Design System
            </button>
        </div>
      </div>
    </div>
  );
};
