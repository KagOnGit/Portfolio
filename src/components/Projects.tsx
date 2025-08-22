"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, BarChart3, TrendingUp, Brain } from "lucide-react";

const projects = [
  {
    id: "deallens",
    title: "DealLens AI",
    subtitle: "AI-Driven M&A Screening Platform",
    description: "Advanced AI-powered platform for mergers & acquisitions screening, leveraging vector search and LLM prompt engineering to deliver faster deal sourcing and defensible investment narratives.",
    tech: ["Next.js", "TypeScript", "Vector Search", "LLM APIs", "TailwindCSS"],
    outcomes: [
      "40% faster deal screening process",
      "Enhanced due diligence accuracy",
      "Automated investment thesis generation"
    ],
    links: {
      live: "https://deal-lens-ai-ma-screener.vercel.app",
      demo: "https://deal-lens-ai-ma-screener.vercel.app"
    },
    icon: Brain,
    category: "FinTech AI"
  },
  {
    id: "nus-analytics",
    title: "NUS Global Immersion Project",
    subtitle: "Airbnb Market Analytics & Strategy",
    description: "Comprehensive data analytics project during NUS Global Immersion Program, analyzing Airbnb datasets to identify pricing strategies, occupancy drivers, and market opportunities.",
    tech: ["Power BI", "Orange Data Mining", "Excel VBA", "Python", "Statistical Analysis"],
    outcomes: [
      "Identified key pricing levers for 15% revenue optimization",
      "Built predictive occupancy models",
      "Created actionable executive dashboards"
    ],
    links: {
      certificate: "https://credentials.nus.edu.sg/3c2fa566-3bb9-4401-9b4b-93c4b7b7f8bb#acc.Eb4QxwFr"
    },
    icon: BarChart3,
    category: "Data Analytics"
  },
  {
    id: "portfolio-evolution",
    title: "Interactive Finance Portfolio",
    subtitle: "Professional Portfolio Platform",
    description: "Modern, interactive portfolio website showcasing finance and technology expertise with professional design, smooth animations, and responsive layout.",
    tech: ["Next.js", "TypeScript", "Framer Motion", "TailwindCSS", "Vercel"],
    outcomes: [
      "Professional brand presence",
      "Interactive user experience",
      "Responsive design across devices"
    ],
    links: {
      github: "https://github.com/KagOnGit/Portfolio",
      live: "https://portfolio-website-three-theta-87.vercel.app"
    },
    icon: TrendingUp,
    category: "Web Development"
  }
];

export default function Projects() {
  return (
    <div className="grid gap-8 md:gap-12">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="card-pro group p-6"
        >
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Project Icon & Category */}
            <div className="flex-shrink-0">
              <div className="icon-badge">
                <project.icon className="text-[#00b9fc]" size={26} />
              </div>
              <div className="text-xs text-[#d4af37] font-medium mt-2 body-text-medium">
                {project.category}
              </div>
            </div>

            {/* Project Content */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 body-text-medium">
                    {project.title}
                  </h3>
                  <p className="text-[#00b9fc] font-medium body-text">
                    {project.subtitle}
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="project-actions">
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pro" data-variant="demo"
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                  )}
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pro" data-variant="code"
                    >
                      <Github size={16} />
                      Code
                    </a>
                  )}
                  {project.links.certificate && (
                    <a
                      href={project.links.certificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pro" data-variant="demo"
                    >
                      <ExternalLink size={16} />
                      Certificate
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-white/80 mb-6 body-text leading-relaxed">
                {project.description}
              </p>

              {/* Key Outcomes */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-[#d4af37] mb-3 body-text-medium">
                  Key Outcomes
                </h4>
                <ul className="space-y-2">
                  {project.outcomes.map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-white/70 text-sm body-text">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00b9fc] mt-2 flex-shrink-0" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack */}
              <div>
                <h4 className="text-sm font-medium text-[#d4af37] mb-3 body-text-medium">
                  Technology Stack
                </h4>
                <div className="tech-chips">
                  {project.tech.map((tech) => (
                    <span key={tech} className="chip body-text">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
