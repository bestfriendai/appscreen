import React, { memo } from 'react';
import { Loader2, Check, Sparkles } from 'lucide-react';
import { GENERATION_MIN_DURATION_SECONDS, GENERATION_MAX_DURATION_SECONDS } from '../constants/timing';

export interface GenerationStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete' | 'error';
  progress?: number;
}

interface GenerationProgressProps {
  steps: GenerationStep[];
  isOpen: boolean;
}

const GenerationProgressComponent: React.FC<GenerationProgressProps> = ({ steps, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-surfaceHighlight rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-[0_0_100px_-20px_rgba(0,209,255,0.2)] animate-in zoom-in-95 duration-200 relative overflow-hidden">

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>

        <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 relative">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                <div className="absolute inset-0 rounded-full border border-primary/30 border-t-transparent animate-[spin_2s_linear_infinite]"></div>
                <div className="absolute inset-1 rounded-full border border-primary/10 border-b-transparent animate-[spin_3s_linear_infinite_reverse]"></div>
            </div>
            <h3 className="text-xl font-bold text-white font-display tracking-wide">
            INITIALIZING GENERATION
            </h3>
            <p className="text-primary/70 text-[10px] mt-2 uppercase tracking-[0.3em] font-mono">NEURAL NETWORKS ACTIVE</p>
        </div>

        <div className="space-y-6 relative z-10">
          {steps.map((step, i) => (
            <div key={step.id} className="relative group">
              {/* Vertical Line */}
              {i !== steps.length - 1 && (
                  <div className={`absolute left-[19px] top-8 bottom-[-24px] w-0.5 ${step.status === 'complete' ? 'bg-primary/30' : 'bg-white/5'}`}></div>
              )}

              <div className="flex items-start gap-4">
                <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border transition-all duration-500
                    ${step.status === 'complete' ? 'bg-primary/20 border-primary text-primary' : ''}
                    ${step.status === 'active' ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(0,209,255,0.4)]' : ''}
                    ${step.status === 'pending' ? 'bg-black/40 border-white/5 text-gray-700' : ''}
                    ${step.status === 'error' ? 'bg-red-500/20 border-red-500 text-red-500' : ''}
                `}>
                    {step.status === 'complete' && <Check className="w-5 h-5" />}
                    {step.status === 'active' && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
                    {step.status === 'pending' && <span className="text-xs font-mono font-bold">{i + 1}</span>}
                    {step.status === 'error' && <span className="text-xs font-mono font-bold">!</span>}
                </div>

                <div className="flex-1 pt-1.5">
                  <p
                    className={`text-xs font-bold uppercase tracking-wider transition-all font-mono ${
                      step.status === 'active' ? 'text-primary' : step.status === 'complete' ? 'text-gray-400' : 'text-gray-700'
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.status === 'active' && step.progress !== undefined && (
                    <div className="relative mt-3 h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_10px_rgba(0,209,255,0.8)] transition-all duration-300 ease-out"
                        style={{ width: `${step.progress}%` }}
                      />
                      {/* Scanning effect */}
                      <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]"></div>
                    </div>
                  )}
                  {step.status === 'active' && (
                     <p className="text-[9px] text-primary/50 mt-1 font-mono animate-pulse">Processing data stream...</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export default memo(GenerationProgressComponent);
