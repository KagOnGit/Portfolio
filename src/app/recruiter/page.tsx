import Link from "next/link";
import SceneWrapper from "@/components/vn/SceneWrapper";

export const metadata = { title: "Recruiter Mode — Aditya Singh" };

export default function RecruiterPage() {
  return (
    <SceneWrapper>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Aditya Singh</h1>
          <p className="text-white/70 text-lg">Final-year B.Tech CSSE · Tech × Finance (IB focus)</p>
          <p className="text-neon text-sm mt-2">Quick Overview for Recruiters</p>
        </div>

        <section className="v-card">
          <h2 className="text-xl font-semibold mb-4 text-neon">🚀 Key Projects</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold">DealLens — AI M&A Screener</h3>
              <p className="text-white/80 text-sm">Next.js, vector search, LLM prompt engineering</p>
              <p className="text-white/70 text-sm mt-1">Accelerates target discovery and deal thesis building for M&A professionals</p>
            </div>
            <div>
              <h3 className="font-semibold">NUS Global Immersion Programme — Airbnb Analytics</h3>
              <p className="text-white/80 text-sm">Power BI, Orange Data Mining, Excel</p>
              <p className="text-white/70 text-sm mt-1">Comprehensive data analysis revealing pricing levers and occupancy drivers</p>
            </div>
          </div>
        </section>

        <section className="v-card">
          <h2 className="text-xl font-semibold mb-4 text-neon">🛠 Technical Skills</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Frontend & Full-Stack</h3>
              <ul className="text-white/80 space-y-1">
                <li>• Next.js / React / TypeScript</li>
                <li>• Tailwind CSS / Framer Motion</li>
                <li>• API Development</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Data & Finance</h3>
              <ul className="text-white/80 space-y-1">
                <li>• Data Analysis / EDA / Visualization</li>
                <li>• CFA Level 1 Concepts</li>
                <li>• Financial Modeling</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="v-card">
          <h2 className="text-xl font-semibold mb-4 text-neon">🏅 Certifications</h2>
          <ul className="space-y-2 text-white/80">
            <li>• <strong>NUS Global Immersion Programme Certificate</strong> — Singapore (Verified)</li>
            <li>• <strong>Financial Markets (Yale University)</strong> — Coursera (Verified)</li>
            <li>• <strong>AI for Everyone</strong> — Coursera (Verified)</li>
          </ul>
        </section>

        <section className="v-card">
          <h2 className="text-xl font-semibold mb-4 text-neon">📧 Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <p><strong>Email:</strong> <a href="mailto:adityasingh0929@gmail.com" className="text-neon">adityasingh0929@gmail.com</a></p>
              <p><strong>Phone:</strong> <a href="tel:+919818722103" className="text-neon">+91 98187 22103</a></p>
            </div>
            <div>
              <p><strong>GitHub:</strong> <a href="https://github.com/KagOnGit" target="_blank" className="text-neon">KagOnGit</a></p>
              <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/aditya-singh-9b1193261" target="_blank" className="text-neon">Profile</a></p>
            </div>
          </div>
        </section>

        <section className="v-card">
          <h2 className="text-xl font-semibold mb-4 text-neon">🎯 Career Objective</h2>
          <p className="text-white/80 leading-relaxed">
            Seeking opportunities in <strong>Investment Banking</strong> and <strong>FinTech</strong> where I can leverage my 
            technical skills in full-stack development and data analysis, combined with my growing financial acumen, 
            to drive data-driven decision making and innovative solutions in the financial sector.
          </p>
        </section>

        <div className="text-center pt-4">
          <div className="flex gap-3 justify-center">
            <Link href="/" className="btn">← Visual Novel Mode</Link>
            <Link href="/resume" className="btn">📄 Full Resume</Link>
            <Link href="/contact" className="btn">📧 Get In Touch</Link>
          </div>
        </div>
      </div>
    </SceneWrapper>
  );
}
