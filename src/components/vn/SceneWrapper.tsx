"use client";
import React from "react";
import { ReactNode } from "react";
import { Github, Linkedin, ExternalLink, Mail } from "lucide-react";
import Image from "next/image";
import FxToggle from "@/components/fx/FxToggle";

function HeaderAvatar() {
  const [src, setSrc] = React.useState("/avatar.png");
  
  return (
    <Image
      src={src}
      alt="Aditya Singh"
      width={56}
      height={56}
      priority
      onError={() => setSrc("/avatar-fallback.svg")}
      className="header-avatar rounded-full border-2 border-blue-400 shadow-md hover:shadow-blue-500/50 transition"
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
    <div className="min-h-screen section-surface w-full relative overflow-hidden">
      
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
            <a className="nav-btn" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              Resume
            </a>
            <a className="nav-btn" href="#projects">
              Projects
            </a>
            <a className="nav-btn" href="#certificates">
              Certificates
            </a>
            <a className="nav-btn flex items-center gap-1" href="https://deal-lens-ai-ma-screener.vercel.app" target="_blank" rel="noreferrer" onClick={onOpenDealLens}>
              <ExternalLink size={16}/> DealLens
            </a>
            <a className="nav-btn" href="#contact">
              Contact
            </a>
            <FxToggle />
          </div>
          
          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <a className="nav-btn" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              Resume
            </a>
            <a className="nav-btn" href="#contact">
              Contact
            </a>
          </div>
        </div>
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
