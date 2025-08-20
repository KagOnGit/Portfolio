"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import SceneWrapper from "@/components/vn/SceneWrapper";
import Certificates from "@/components/Certificates";
import Projects from "@/components/Projects";
import { ExternalLink, Mail, Phone, Download } from "lucide-react";

export default function Page() {
  // Smooth scrolling navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowUp' || e.key === 'k') {
        window.scrollBy({ top: -80, behavior: 'smooth' });
      }
      if (e.key === 'ArrowDown' || e.key === 'j') {
        window.scrollBy({ top: 80, behavior: 'smooth' });
      }
    }
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <SceneWrapper onOpenDealLens={() => { /* optional analytics */ }}>
      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00b9fc]/30 bg-[#00b9fc]/10 text-sm text-[#00b9fc] mb-6">
            <span>Professional Portfolio</span>
            <span>·</span>
            <span>Finance & Technology</span>
          </div>
          
          <h1 className="heading text-accent text-4xl md:text-6xl mb-6">
            Aditya Singh | Tech × Finance
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-4 body-text-medium">
            Aspiring Investment Banking / FinTech Professional
          </p>
          
          <p className="text-lg text-white/60 mb-8 body-text max-w-2xl mx-auto">
            Bridging data-driven innovation with financial strategy.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#projects" className="finance-btn">
              View Projects
            </a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="finance-btn-secondary flex items-center gap-2">
              <Download size={18} />
              Resume
            </a>
            <a href="https://deal-lens-ai-ma-screener.vercel.app" target="_blank" rel="noreferrer" className="finance-btn flex items-center gap-2">
              <ExternalLink size={18} />
              DealLens AI
            </a>
          </div>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="heading text-accent text-3xl md:text-4xl text-center mb-12">
            Case Studies & Projects
          </h2>
          <Projects />
        </motion.div>
      </section>

      {/* Certificates Section */}
      <section id="certificates" className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="heading text-accent text-3xl md:text-4xl text-center mb-12">
            Professional Credentials
          </h2>
          <Certificates />
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="heading text-accent text-3xl md:text-4xl mb-8">
            Get In Touch
          </h2>
          <p className="text-lg text-white/70 mb-8 body-text max-w-2xl mx-auto">
            Interested in finance, technology, or potential opportunities? Let&apos;s connect.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <a href="mailto:adityasingh0929@gmail.com" className="tile frame p-6 hover:scale-105 transition-transform flex items-center gap-3">
              <Mail className="text-[#00b9fc]" size={24} />
              <div>
                <div className="font-medium body-text-medium">Email</div>
                <div className="text-white/70 body-text">adityasingh0929@gmail.com</div>
              </div>
            </a>
            
            <a href="tel:+919818722103" className="tile frame p-6 hover:scale-105 transition-transform flex items-center gap-3">
              <Phone className="text-[#d4af37]" size={24} />
              <div>
                <div className="font-medium body-text-medium">Phone</div>
                <div className="text-white/70 body-text">+91 98187 22103</div>
              </div>
            </a>
          </div>
        </motion.div>
      </section>
    </SceneWrapper>
  );
}
