export function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vn-portfolio-aditya.vercel.app";
  
  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml`,
    {
      headers: { 
        "Content-Type": "text/plain",
      },
    }
  );
}
