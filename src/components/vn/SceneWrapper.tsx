"use client";
import React from "react";
import { ReactNode } from "react";
import { Github, Linkedin, ExternalLink, Mail } from "lucide-react";
import Image from "next/image";
import ParallaxBackdrop from "@/components/fx/ParallaxBackdrop";
import FinanceBackdrop from "@/components/fx/FinanceBackdrop";
import FinanceReveal from "@/components/fx/FinanceReveal";
import BlueEdges from "@/components/fx/BlueEdges";
import FinanceAurora from "@/components/fx/FinanceAurora";
import FinanceTextField from "@/components/fx/FinanceTextField";
import SpotlightReveal from "@/components/fx/SpotlightReveal";
import FxToggle from "@/components/fx/FxToggle";

function HeaderAvatar() {
  const [src, setSrc] = React.useState("/avatar.png");
  
  return (
    <Image
      src={src}
      alt="Aditya Singh"
      width={40}
      height={40}
      priority
      onError={() => setSrc("/avatar-fallback.svg")}
      className="rounded-full border-2 border-blue-400 shadow-md hover:shadow-blue-500/50 transition"
    />
  );
}

export default function SceneWrapper({
  children,
  onOpenDealLens,
}: {
  children: ReactNode;
  onOpenDealLens?: () => void;
}) {
  // optional: any global side effects

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <BlueEdges />
      <div className="fx-hidden">
        <FinanceAurora />
      </div>
      <div className="fx-hidden">
        <FinanceTextField />
      </div>
      <SpotlightReveal />
      <FinanceReveal />
      <FinanceBackdrop />
      <ParallaxBackdrop />
      
      {/* Top Nav */}
      <div className="fixed left-0 right-0 top-0 z-20">
        <div className="mx-auto max-w-6xl flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <a href="https://www.linkedin.com/in/aditya-singh-9b1193261" target="_blank" rel="noreferrer" className="flex-shrink-0 transform hover:scale-105 active:scale-95 transition-transform" aria-label="View LinkedIn profile">
              <HeaderAvatar />
            </a>
            <div className="font-semibold tracking-wide">Aditya Singh</div>
            <span className="text-white/50 text-sm">Tech × Finance</span>
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <a className="glass-btn flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-transform" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              Resume
            </a>
            <a className="glass-btn flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-transform" href="#projects">
              Projects
            </a>
            <a className="glass-btn flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-transform" href="#certificates">
              Certificates
            </a>
            <a className="glass-btn flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-transform" href="https://deal-lens-ai-ma-screener.vercel.app" target="_blank" rel="noreferrer" onClick={onOpenDealLens}>
              <ExternalLink size={16}/> DealLens
            </a>
            <a className="glass-btn flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-transform" href="#contact">
              Contact
            </a>
            <FxToggle />
          </div>
          
          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <a className="glass-btn flex items-center gap-2" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              Resume
            </a>
            <a className="glass-btn flex items-center gap-2" href="#contact">
              Contact
            </a>
          </div>
        </div>
      </div>

      {/* Additional backdrop glow */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -left-32 top-0 h-[120vh] w-[120vw] bg-[radial-gradient(closest-side,rgba(0,185,252,0.06),transparent)]" />
        <div className="absolute -right-32 bottom-0 h-[120vh] w-[120vw] bg-[radial-gradient(closest-side,rgba(212,175,55,0.04),transparent)]" />
      </div>

      {/* Content */}
      <main className="pt-20 px-4">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-white/10">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4 px-4 text-xs text-white/50">
          <span className="body-text">© {new Date().getFullYear()} Aditya Singh • Interactive Finance Portfolio</span>
          <div className="flex items-center gap-4">
            <a href="https://github.com/KagOnGit" target="_blank" rel="noreferrer" className="hover:text-[#00b9fc] transition-colors">
              <Github size={16}/>
            </a>
            <a href="https://www.linkedin.com/in/aditya-singh-9b1193261" target="_blank" rel="noreferrer" className="hover:text-[#00b9fc] transition-colors">
              <Linkedin size={16}/>
            </a>
            <a href="mailto:adityasingh0929@gmail.com" className="hover:text-[#00b9fc] transition-colors">
              <Mail size={16}/>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
