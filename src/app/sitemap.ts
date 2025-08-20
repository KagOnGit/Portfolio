export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vn-portfolio-aditya.vercel.app";
  
  return [
    { 
      url: `${base}/`, 
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1
    },
    { 
      url: `${base}/resume`, 
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8
    },
    { 
      url: `${base}/recruiter`, 
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9
    },
    { 
      url: `${base}/contact`, 
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7
    },
  ];
}
