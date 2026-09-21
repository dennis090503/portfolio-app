import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Linkedin, Github, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import MagneticButton from '../ui/MagneticButton';
import { contact } from '../../data/content';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to send message.');
      }

      setIsSubmitting(false);
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Contact submission error:', err);
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Unable to deliver message at this time. Please try again later.');
    }
  };

  const links = [
    { icon: Mail, label: contact.email, href: `mailto:${contact.email}`, target: '_self' },
    contact.location && { icon: MapPin, label: contact.location, href: '#', target: '_self' },
    { icon: Linkedin, label: 'LinkedIn', href: contact.linkedin, target: '_blank' },
    { icon: Github, label: 'GitHub', href: contact.github, target: '_blank' },
  ].filter(Boolean);

  return (
    <section id="contact" className="relative py-16 md:py-24 overflow-hidden bg-background transition-colors duration-500">
      
      {/* Decorative Radial Background Mesh (Adapts automatically for Cyberpunk Neon feels) */}
      <div className="absolute bottom-0 right-1/4 -z-10 w-[500px] h-[500px] bg-accent/[0.04] dark:bg-[#FF007A]/[0.03] rounded-full blur-[140px] pointer-events-none transition-all duration-500" />
      <div className="absolute top-1/3 left-1/4 -z-10 w-[400px] h-[400px] bg-[#00F0FF]/[0.02] rounded-full blur-[120px] pointer-events-none dark:block hidden" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Contact" title="Let's build something" />

        <div className="grid md:grid-cols-5 gap-6 md:gap-8 mt-8 md:mt-14 items-stretch">
          {/* Information Channel Panel */}
          <div className="md:col-span-2 bg-surface border border-line/60 rounded-3xl p-5 sm:p-6 md:p-8 shadow-soft flex flex-col justify-between gap-8 md:gap-10 transition-all duration-500 dark:shadow-[0_0_50px_rgba(0,0,0,0.3)] max-w-full overflow-hidden">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-primary mb-3">Get in touch</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Open to new opportunities, collaborations, and interesting architectural challenges. Reach out through any of these communication channels.
              </p>
            </div>

            <div className="space-y-3.5 min-w-0">
              {links.map(({ icon: Icon, label, href, target }) => (
                <a
                  key={label}
                  href={href}
                  target={target}
                  rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                  className="group flex items-center gap-3.5 p-3 rounded-xl bg-background border border-line/40 hover:border-accent/50 dark:hover:border-[#00F0FF]/50 hover:shadow-soft text-sm font-medium text-text-muted hover:text-accent dark:hover:text-[#00F0FF] dark:hover:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all duration-300 min-w-0 max-w-full overflow-hidden"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface border border-line flex items-center justify-center text-text-muted group-hover:text-accent dark:group-hover:text-[#00F0FF] group-hover:bg-accent/[0.04] dark:group-hover:bg-[#00F0FF]/[0.05] transition-all duration-300 flex-shrink-0">
                    <Icon size={16} />
                  </div>
                  <span className="truncate min-w-0 flex-1">{label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Interactive Form Panel */}
          <div className="md:col-span-3 bg-surface border border-line/60 rounded-3xl p-5 sm:p-6 md:p-8 shadow-soft relative min-h-[380px] flex flex-col justify-center transition-all duration-500 max-w-full overflow-hidden">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full text-center py-10 flex flex-col items-center justify-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 dark:bg-[#00F0FF]/10 dark:border-[#00F0FF]/30 flex items-center justify-center text-accent dark:text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.15)]">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-primary mb-1">Message Sent!</h4>
                    <p className="text-text-muted text-sm max-w-xs mx-auto">
                      Thanks for reaching out, Dennis. I've received your transmission and will get back to you shortly.
                    </p>
                  </div>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-semibold text-accent dark:text-[#00F0FF] hover:underline mt-4"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form 
                  onSubmit={handleSubmit} 
                  className="space-y-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Name</label>
                      <input
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                        disabled={isSubmitting}
                        className="w-full bg-background border border-line rounded-xl px-4 py-3 text-base sm:text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent dark:focus:border-[#00F0FF] focus:ring-2 focus:ring-accent/10 dark:focus:ring-[#00F0FF]/10 disabled:opacity-60 transition-all min-h-[44px]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Email</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        disabled={isSubmitting}
                        className="w-full bg-background border border-line rounded-xl px-4 py-3 text-base sm:text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent dark:focus:border-[#00F0FF] focus:ring-2 focus:ring-accent/10 dark:focus:ring-[#00F0FF]/10 disabled:opacity-60 transition-all min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project..."
                      rows={5}
                      required
                      disabled={isSubmitting}
                      className="w-full bg-background border border-line rounded-xl px-4 py-3 text-base sm:text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent dark:focus:border-[#00F0FF] focus:ring-2 focus:ring-accent/10 dark:focus:ring-[#00F0FF]/10 disabled:opacity-60 transition-all resize-none"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3 text-xs rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 flex gap-2 items-center">
                      <AlertCircle size={14} className="flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="pt-2 w-full sm:w-auto flex justify-center sm:justify-start">
                    <MagneticButton 
                      variant="primary" 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full sm:w-auto flex items-center justify-center gap-2.5 !px-7 !py-3 disabled:opacity-50 !text-white dark:!text-black dark:bg-[#00F0FF] dark:hover:shadow-[0_0_20px_rgba(0,240,255,0.35)] min-h-[44px]"
                    >
                      <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                      <Send size={14} className={isSubmitting ? "animate-pulse" : ""} />
                    </MagneticButton>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}