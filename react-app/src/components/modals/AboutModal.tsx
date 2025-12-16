import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Github,
  Twitter,
  Heart,
  ExternalLink,
  Palette,
  Languages,
  Box,
  Download,
  Wand2,
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const features = [
  { icon: Sparkles, label: 'AI-Powered Design', description: 'Magic Design with Gemini AI' },
  { icon: Palette, label: 'Beautiful Gradients', description: 'Professional color schemes' },
  { icon: Languages, label: 'Multi-Language', description: 'Localized screenshots' },
  { icon: Box, label: '3D Device Frames', description: 'Realistic iPhone mockups' },
  { icon: Download, label: 'Batch Export', description: 'PNG, JPG, ZIP support' },
  { icon: Wand2, label: '26+ Templates', description: 'Ready-to-use designs' },
];

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-bg-secondary border border-border overflow-hidden"
          >
            {/* Header with gradient */}
            <div className="relative overflow-hidden">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent via-purple-500 to-pink-500 opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary to-transparent" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/20 hover:bg-black/30 transition-colors z-10"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Content */}
              <div className="relative pt-8 pb-6 px-6 text-center">
                {/* Logo */}
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent via-purple-500 to-pink-500 flex items-center justify-center shadow-xl shadow-accent/30">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>

                <h1 className="text-2xl font-bold text-text-primary mb-1">
                  AppScreen
                </h1>
                <p className="text-sm text-text-secondary mb-2">
                  Professional App Store Screenshot Generator
                </p>
                <div className="inline-flex items-center gap-2 text-xs text-text-secondary bg-bg-tertiary px-3 py-1 rounded-full">
                  <span>Version 2.0.0</span>
                  <span className="w-1 h-1 bg-green-500 rounded-full" />
                  <span className="text-green-500">Latest</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="p-6 space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {features.map((feature) => (
                  <div
                    key={feature.label}
                    className="flex items-start gap-3 p-3 rounded-lg bg-bg-tertiary"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-text-primary">
                        {feature.label}
                      </p>
                      <p className="text-2xs text-text-secondary">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="px-6 pb-4">
              <div className="flex items-center justify-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-tertiary hover:bg-[#252528] transition-colors text-sm text-text-secondary hover:text-text-primary"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-tertiary hover:bg-[#252528] transition-colors text-sm text-text-secondary hover:text-text-primary"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border text-center">
              <p className="text-xs text-text-secondary flex items-center justify-center gap-1">
                Made with <Heart className="w-3 h-3 text-red-500" /> for indie developers
              </p>
              <p className="text-2xs text-text-secondary/60 mt-1">
                © {new Date().getFullYear()} AppScreen. All rights reserved.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
