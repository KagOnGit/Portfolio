'use client';
import React from "react";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import FxToggle from '@/components/FxToggle';

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

export default function Header({ onOpenDealLens }: { onOpenDealLens?: () => void }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-20">
      <div className="mx-auto max-w-6xl flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <a href="https://www.linkedin.com/in/aditya-singh-9b1193261" target="_blank" rel="noreferrer" className="flex-shrink-0 transform hover:scale-105 active:scale-95 transition-transform" aria-label="View LinkedIn profile">
            <HeaderAvatar />
          </a>
          <div className="font-semibold tracking-wide">Aditya Singh</div>
          <span className="text-white/50 text-sm">Tech × Finance</span>
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <a className="nav-btn" href="#about">
            About
          </a>
          <a className="nav-btn" href="#projects">
            Projects
          </a>
          <a className="nav-btn" href="#certificates">
            Certificates
          </a>
          <a className="nav-btn" href="#extracurricular">
            Achievements
          </a>
          <a className="nav-btn" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
            Resume
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
          <FxToggle />
        </div>
      </div>
    </header>
  );
}
