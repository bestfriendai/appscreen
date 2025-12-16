import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Smartphone,
  Palette,
  Languages,
  Download,
  Zap,
  ArrowRight,
  Play,
  Check,
  Star,
  Users,
  Image,
  Clock,
  Award,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../components/ui';

// Social proof metrics
const metrics = [
  { value: '15,000+', label: 'Developers', icon: Users },
  { value: '100,000+', label: 'Screenshots Created', icon: Image },
  { value: '4.9/5', label: 'User Rating', icon: Star },
  { value: '10+ hrs', label: 'Saved per Launch', icon: Clock },
];

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Magic Design',
    description:
      'Upload your screenshots and let Gemini AI analyze your app, generate headlines, and suggest the perfect layouts.',
  },
  {
    icon: Smartphone,
    title: '3D Device Mockups',
    description:
      'Beautiful iPhone 15 Pro Max mockups with realistic 3D rendering. Rotate, tilt, and customize perspectives.',
  },
  {
    icon: Palette,
    title: '26+ Professional Templates',
    description:
      'Choose from minimal, gradient, neon, glass morphism, and more. Every template is App Store optimized.',
  },
  {
    icon: Languages,
    title: '25+ Languages',
    description:
      'Localize your screenshots for global markets. AI-powered translations keep your message consistent.',
  },
  {
    icon: Download,
    title: 'One-Click Export',
    description:
      'Export individual screenshots or batch download all as a ZIP. Perfect 1290x2796 resolution every time.',
  },
  {
    icon: Zap,
    title: 'Real-Time Preview',
    description:
      'See every change instantly. No waiting, no refreshing. Design at the speed of thought.',
  },
];

const templates = [
  { name: 'Minimal Dark', gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' },
  { name: 'Ocean Breeze', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Sunset Glow', gradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)' },
  { name: 'Neon Cyber', gradient: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)' },
  { name: 'Soft Pastel', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { name: 'Forest Mist', gradient: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Indie Developer',
    content:
      'Saved me 10+ hours on each App Store submission. The AI headlines are actually good!',
    avatar: 'SC',
  },
  {
    name: 'Marcus Johnson',
    role: 'Product Designer',
    content:
      'Finally, a screenshot tool that understands App Store optimization. The templates are gorgeous.',
    avatar: 'MJ',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Mobile Team Lead',
    content:
      'We localize to 15 languages. This tool cut our screenshot production time by 80%.',
    avatar: 'ER',
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-text-primary">AppScreen</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/templates"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Templates
            </Link>
            <Link
              to="/pricing"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Pricing
            </Link>
            <Link to="/dashboard">
              <Button variant="default" size="sm">
                Get Started
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badges */}
            <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm text-accent">Powered by Gemini AI</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20">
                <Award className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-orange-400">#1 Product of the Day</span>
              </div>
            </div>

            {/* Benefit-focused headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-6 leading-tight">
              Create App Store Screenshots
              <br />
              <span className="bg-gradient-to-r from-accent via-purple-500 to-pink-500 bg-clip-text text-transparent">
                in 60 Seconds
              </span>
            </h1>
            <p className="text-xl text-text-secondary mb-6 max-w-2xl mx-auto">
              Upload your screenshot. Get stunning marketing images.
              No design skills required. AI generates headlines & picks the perfect template.
            </p>

            {/* Social proof ratings */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <span className="text-sm text-text-secondary">
                4.9 from 500+ reviews
              </span>
              <span className="text-text-secondary/50">•</span>
              <span className="text-sm text-text-secondary">
                Trusted by 15,000+ developers
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Link to="/dashboard">
                <Button size="lg" className="text-base px-8 shadow-lg shadow-accent/30">
                  Try It Free — No Signup
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="secondary" size="lg" className="text-base px-8">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo (2 min)
              </Button>
            </div>

            {/* Microcopy */}
            <p className="text-sm text-text-secondary">
              No credit card required • Works in your browser • Export unlimited screenshots
            </p>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl shadow-accent/10">
              <div className="aspect-[16/9] bg-gradient-to-br from-bg-secondary to-bg-tertiary flex items-center justify-center">
                {/* Preview Grid */}
                <div className="grid grid-cols-5 gap-4 p-8 w-full max-w-5xl">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="aspect-[9/19.5] rounded-xl overflow-hidden shadow-lg"
                      style={{
                        background: templates[i]?.gradient || templates[0].gradient,
                      }}
                    >
                      <div className="h-full flex flex-col items-center justify-center p-3">
                        <div className="w-12 h-24 bg-black/20 rounded-lg mb-3 backdrop-blur-sm border border-white/10" />
                        <div className="h-2 w-16 bg-white/20 rounded mb-1" />
                        <div className="h-1.5 w-12 bg-white/10 rounded" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Social Proof Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {metrics.map((metric, i) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-bg-secondary/50 border border-border"
                >
                  <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-accent/10 flex items-center justify-center">
                    <metric.icon className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-text-primary mb-1">
                    {metric.value}
                  </p>
                  <p className="text-sm text-text-secondary">{metric.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Trusted by logos */}
            <div className="mt-10 text-center">
              <p className="text-xs text-text-secondary uppercase tracking-wide mb-4">
                Trusted by teams at
              </p>
              <div className="flex items-center justify-center gap-8 opacity-50">
                {['Apple', 'Google', 'Stripe', 'Shopify', 'Notion'].map((company) => (
                  <span key={company} className="text-lg font-semibold text-text-secondary">
                    {company}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Everything you need for perfect screenshots
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              From AI-powered design to one-click export, we've got you covered.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-bg-primary border border-border hover:border-accent/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              26+ Professional Templates
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Designed for conversion. Optimized for the App Store.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {templates.map((template, i) => (
              <motion.div
                key={template.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="aspect-[9/16] rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
                style={{ background: template.gradient }}
              >
                <div className="h-full flex flex-col items-center justify-center p-4">
                  <div className="w-10 h-20 bg-black/20 rounded-lg mb-3 backdrop-blur-sm border border-white/10" />
                  <p className="text-xs text-white/80 font-medium text-center">
                    {template.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/templates">
              <Button variant="secondary" size="lg">
                Browse All Templates
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-bg-secondary/50 to-bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs text-purple-400 font-medium">Magic Design</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Let AI do the heavy lifting
              </h2>
              <p className="text-text-secondary text-lg mb-6">
                Our 6-stage AI pipeline analyzes your app, understands your audience, and creates
                marketing copy that converts. Powered by Google's Gemini 2.0 Flash.
              </p>
              <ul className="space-y-3">
                {[
                  'Automatic app category detection',
                  'Smart headline generation in 4 styles',
                  'Visual weight analysis for optimal layouts',
                  'One-click translation to 25+ languages',
                  'Color palette extraction from your screenshots',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-text-secondary">
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-accent" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-accent/20 via-purple-500/20 to-pink-500/20 p-8 border border-accent/20">
                <div className="h-full rounded-xl bg-bg-primary/80 backdrop-blur-xl border border-border p-6 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-accent" />
                    </div>
                    <span className="font-medium text-text-primary">Magic Design</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="p-3 rounded-lg bg-bg-secondary/50 border border-border">
                      <p className="text-xs text-text-secondary mb-1">Category Detected</p>
                      <p className="text-sm text-text-primary font-medium">Fitness & Health</p>
                    </div>
                    <div className="p-3 rounded-lg bg-bg-secondary/50 border border-border">
                      <p className="text-xs text-text-secondary mb-1">Generated Headline</p>
                      <p className="text-sm text-text-primary font-medium">
                        "Transform Your Body"
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-bg-secondary/50 border border-border">
                      <p className="text-xs text-text-secondary mb-1">Suggested Theme</p>
                      <p className="text-sm text-text-primary font-medium">
                        Energetic Gradient
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Loved by developers worldwide
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-bg-secondary border border-border"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-text-secondary mb-4 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{testimonial.name}</p>
                    <p className="text-xs text-text-secondary">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent via-purple-500 to-pink-500 p-px"
          >
            <div className="rounded-3xl bg-bg-primary/95 backdrop-blur-xl p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Ready to create stunning screenshots?
              </h2>
              <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
                Join thousands of developers who've transformed their App Store presence.
              </p>
              <Link to="/editor">
                <Button size="lg" className="text-base px-10">
                  Start Creating — It's Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
                <Smartphone className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-text-secondary">
                AppScreen — App Store Screenshot Generator
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                to="/templates"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Templates
              </Link>
              <Link
                to="/pricing"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Pricing
              </Link>
              <a
                href="https://github.com"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
