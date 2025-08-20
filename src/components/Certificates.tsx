import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

interface Certificate {
  title: string;
  issuer: string;
  issuedDate: string;
  url: string;
}

const certificates: Certificate[] = [
  {
    title: "Business Analytics for Decision Making",
    issuer: "University of Colorado Boulder",
    issuedDate: "Jul 2025",
    url: "https://www.coursera.org/account/accomplishments/verify/2PN8Q00EPIOC"
  },
  {
    title: "AI-Powered Business Analytics (Intermediate)",
    issuer: "National University of Singapore",
    issuedDate: "Jun 2025", 
    url: "https://credentials.nus.edu.sg/3c2fa566-3bb9-4401-9b4b-93c4b7b7f8bb"
  },
  {
    title: "Strategy and Game Theory for Management",
    issuer: "IIM Ahmedabad",
    issuedDate: "Apr 2025",
    url: "https://www.coursera.org/account/accomplishments/verify/8MCNN6YNELCI"
  }
];

export default function Certificates() {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Certificates & Achievements
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {certificates.map((cert, index) => (
          <div
            key={index}
            className="v-card hover:shadow-lg transition-shadow duration-300"
          >
            {/* Certificate Preview Thumbnail */}
            <div className="relative h-32 w-full mb-4 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={`https://image.thum.io/get/width/300/crop/200/${encodeURIComponent(cert.url)}`}
                alt={`${cert.title} certificate preview`}
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback to gradient background if thumbnail fails
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.className += ' bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center';
                    target.parentElement.innerHTML += '<div class="text-white font-semibold text-sm text-center p-2">Certificate Preview</div>';
                  }
                }}
              />
            </div>

            {/* Certificate Info */}
            <div className="space-y-2">
              <h3 className="font-bold text-white text-lg leading-tight">
                {cert.title}
              </h3>
              
              <p className="text-white/60 text-sm">
                {cert.issuer} • Issued {cert.issuedDate}
              </p>
              
              {/* View Certificate Button */}
              <div className="pt-3">
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  <ExternalLink size={16} />
                  View Certificate
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
