"use client";
import React from "react";
import { ReactNode } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import Header from "@/components/Header";

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
      <Header />


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
