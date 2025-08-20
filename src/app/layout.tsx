import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Aditya Singh — Visual Novel Portfolio",
  description: "Story-driven portfolio blending tech, finance, and anime-inspired storytelling.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "Aditya Singh — Visual Novel Portfolio",
    description: "Explore my journey via a visual novel: DealLens, NUS GiP, and more.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditya Singh — Visual Novel Portfolio",
    description: "Interactive story of my projects and skills.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vn-portfolio-aditya.vercel.app";
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Aditya Singh",
    "jobTitle": "Software Engineer & Data Analyst",
    "description": "Final-year B.Tech CSSE student specializing in tech × finance, with expertise in Next.js, data analysis, and financial markets.",
    "url": siteUrl,
    "sameAs": [
      "https://github.com/KagOnGit",
      "https://www.linkedin.com/in/aditya-singh-9b1193261"
    ],
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "KIIT University"
    },
    "knowsAbout": [
      "Next.js", "TypeScript", "React", "Data Analysis", "Financial Markets", "M&A Analysis"
    ],
    "email": "adityasingh0929@gmail.com",
    "telephone": "+91-98187-22103"
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
