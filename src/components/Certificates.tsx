import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface Certificate {
  title: string;
  issuer: string;
  issuedDate: string;
  url: string;
  previewImage?: string;
}

const certificates: Certificate[] = [
  {
    title: "Business Analytics for Decision Making",
    issuer: "University of Colorado Boulder",
    issuedDate: "Jul 2025",
    url: "https://www.coursera.org/account/accomplishments/verify/2PN8Q00EPIOC",
    previewImage: "https://s3.amazonaws.com/coursera_assets/meta_images/generated/CERTIFICATE_LANDING_PAGE/CERTIFICATE_LANDING_PAGE~2PN8Q00EPIOC/CERTIFICATE_LANDING_PAGE~2PN8Q00EPIOC.jpeg"
  },
  {
    title: "AI-Powered Business Analytics (Intermediate)",
    issuer: "National University of Singapore",
    issuedDate: "Jun 2025", 
    url: "https://credentials.nus.edu.sg/3c2fa566-3bb9-4401-9b4b-93c4b7b7f8bb",
    previewImage: "https://image.thum.io/get/width/400/crop/240/noanimate/wait/10/https://credentials.nus.edu.sg/3c2fa566-3bb9-4401-9b4b-93c4b7b7f8bb"
  },
  {
    title: "Strategy and Game Theory for Management",
    issuer: "IIM Ahmedabad",
    issuedDate: "Apr 2025",
    url: "https://www.coursera.org/account/accomplishments/verify/8MCNN6YNELCI",
    previewImage: "https://s3.amazonaws.com/coursera_assets/meta_images/generated/CERTIFICATE_LANDING_PAGE/CERTIFICATE_LANDING_PAGE~8MCNN6YNELCI/CERTIFICATE_LANDING_PAGE~8MCNN6YNELCI.jpeg"
  }
];

function CertificatePreview({ cert }: { cert: Certificate }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  
  // Define fallback sources with more options for NUS
  const fallbackSources = [
    cert.previewImage,
    // Enhanced thum.io with wait time for dynamic content
    `https://image.thum.io/get/width/400/crop/240/noanimate/wait/5/${encodeURIComponent(cert.url)}`,
    // Alternative thum.io without wait
    `https://image.thum.io/get/width/400/crop/240/noanimate/${encodeURIComponent(cert.url)}`,
    // Alternative screenshot approach
    `https://htmlcsstoimage.com/demo_images/image.png?url=${encodeURIComponent(cert.url)}&width=400&height=240`,
  ].filter(Boolean);
  
  const currentImageSrc = fallbackSources[currentSourceIndex];
  
  const tryNextFallback = () => {
    if (currentSourceIndex < fallbackSources.length - 1) {
      setCurrentSourceIndex(currentSourceIndex + 1);
      setImageLoaded(false);
      setImageError(false);
    } else {
      setImageError(true);
    }
  };
  
  const getInstitutionColor = (issuer: string) => {
    if (issuer.includes('Colorado')) return 'from-yellow-500 to-amber-600';
    if (issuer.includes('Singapore')) return 'from-red-500 to-pink-600';
    if (issuer.includes('IIM')) return 'from-green-500 to-emerald-600';
    return 'from-blue-500 to-blue-600';
  };
  
  return (
    <div className="relative h-32 w-full mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Try to load actual certificate preview */}
      {currentImageSrc && (
        <Image
          src={currentImageSrc}
          alt={`${cert.title} certificate preview`}
          fill
          className={`object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          unoptimized
          onLoad={() => setImageLoaded(true)}
          onError={tryNextFallback}
        />
      )}
      
      {/* Custom styled fallback that always shows */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getInstitutionColor(cert.issuer)} flex items-center justify-center transition-opacity duration-500 ${
        imageLoaded ? 'opacity-0 z-0' : 'opacity-100 z-10'
      }`}>
        <div className="text-white text-center p-3">
          <div className="text-2xl mb-2">
            {cert.issuer.includes('Colorado') ? '🎓' : 
             cert.issuer.includes('Singapore') ? '🏛️' :
             cert.issuer.includes('IIM') ? '📊' : '🏆'}
          </div>
          <div className="font-bold text-sm leading-tight mb-1">
            {cert.title.split(' ').slice(0, 2).join(' ')}
          </div>
          <div className="text-xs opacity-90 font-medium">
            {cert.issuer.split(' ').slice(0, 2).join(' ')}
          </div>
          <div className="text-xs opacity-75 mt-1">
            {cert.issuedDate}
          </div>
        </div>
      </div>
      
      {/* Loading indicator */}
      {!imageLoaded && !imageError && currentSourceIndex < fallbackSources.length - 1 && (
        <div className="absolute top-2 right-2 z-20">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

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
            <CertificatePreview cert={cert} />

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
