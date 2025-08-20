"use client";
import React from "react";
import { ReactNode } from "react";
import { Github, Linkedin, ExternalLink, Mail, Phone } from "lucide-react";
import Image from "next/image";

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
      {/* Top Nav */}
      <div className="fixed left-0 right-0 top-0 z-20">
        <div className="mx-auto max-w-6xl flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <a href="https://www.linkedin.com/in/aditya-singh-9b1193261" target="_blank" rel="noreferrer" className="flex-shrink-0" aria-label="View LinkedIn profile">
              <HeaderAvatar />
            </a>
            <div className="font-semibold tracking-wide">Aditya Singh</div>
            <span className="text-white/50 text-sm">Tech × Finance</span>
          </div>
          <div className="flex items-center gap-2">
            <a className="btn flex items-center gap-2" href="/resume">
              Resume
            </a>
            <a className="btn flex items-center gap-2" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              📄 PDF
            </a>
            <a className="btn flex items-center gap-2" href="/recruiter">
              🎯 Recruiter
            </a>
            <a className="btn flex items-center gap-2" href="/contact">
              Contact
            </a>
            <a className="btn flex items-center gap-2" href="https://github.com/KagOnGit" target="_blank" rel="noreferrer">
              <Github size={16}/> GitHub
            </a>
            <a className="btn flex items-center gap-2" href="https://www.linkedin.com/in/aditya-singh-9b1193261" target="_blank" rel="noreferrer">
              <Linkedin size={16}/> LinkedIn
            </a>
            <a className="btn flex items-center gap-2" href="mailto:adityasingh0929@gmail.com">
              <Mail size={16}/> Email
            </a>
            <a className="btn flex items-center gap-2" href="tel:+919818722103">
              <Phone size={16}/> Call
            </a>
            <a className="btn flex items-center gap-2" href="https://deal-lens-ai-ma-screener.vercel.app" target="_blank" rel="noreferrer" onClick={onOpenDealLens}>
              <ExternalLink size={16}/> DealLens
            </a>
          </div>
        </div>
      </div>

      {/* Backdrop grid glow */}
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -left-32 top-0 h-[120vh] w-[120vw] bg-[radial-gradient(closest-side,rgba(0,185,252,0.08),transparent)]" />
      </div>

      {/* Content */}
      <main className="pt-20 pb-20 px-4">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-10">
        <div className="mx-auto max-w-6xl flex justify-between items-center p-4 text-xs text-white/50">
          <span>© {new Date().getFullYear()} Aditya Singh • Interactive VN Portfolio</span>
          <span>Built with Next.js · Tailwind · Framer Motion</span>
        </div>
      </footer>
    </div>
  );
}
