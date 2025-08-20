"use client";
import { useState } from "react";
import Link from "next/link";
import SceneWrapper from "@/components/vn/SceneWrapper";

export default function ContactPage() {
  const [status, setStatus] = useState<string>("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Sending...");
    
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    
    try {
      const res = await fetch("/api/contact", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload) 
      });
      
      if (res.ok) {
        setStatus("Message sent! I will get back to you soon.");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("Something went wrong. Please try again.");
      }
    } catch {
      setStatus("Network error. Please try again.");
    }
  }

  return (
    <SceneWrapper>
      <div className="mx-auto max-w-xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Get In Touch</h1>
          <p className="text-white/70">Have a project in mind? Let&apos;s discuss opportunities.</p>
        </div>
        
        <form onSubmit={submit} className="v-card space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input name="name" type="text" placeholder="Your name" className="input" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input name="email" type="email" placeholder="your@email.com" className="input" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea 
              name="message" 
              placeholder="Tell me about your project or opportunity..."
              className="textarea h-32" 
              required 
            />
          </div>
          
          {/* Honeypot field - hidden from users but visible to bots */}
          <input 
            name="honeypot" 
            className="hidden" 
            tabIndex={-1} 
            autoComplete="off"
            aria-hidden="true"
          />
          
          <button className="btn w-full" type="submit">Send Message</button>
          
          {status && (
            <div className={`text-sm p-3 rounded-xl ${
              status.includes('sent') ? 'bg-green-500/20 text-green-300' : 
              status.includes('error') || status.includes('wrong') ? 'bg-red-500/20 text-red-300' :
              'bg-blue-500/20 text-blue-300'
            }`}>
              {status}
            </div>
          )}
        </form>
        
        <div className="mt-6 text-center">
          <Link href="/" className="btn">← Back to Portfolio</Link>
        </div>
        
        <div className="v-card mt-6 text-sm text-white/80">
          <h3 className="font-semibold mb-2">Other ways to reach me:</h3>
          <div>Email: <a href="mailto:adityasingh0929@gmail.com">adityasingh0929@gmail.com</a></div>
          <div>Phone: <a href="tel:+919818722103">+91 98187 22103</a></div>
          <div>LinkedIn: <a href="https://www.linkedin.com/in/aditya-singh-9b1193261" target="_blank" rel="noreferrer">Connect with me</a></div>
        </div>
      </div>
    </SceneWrapper>
  );
}
