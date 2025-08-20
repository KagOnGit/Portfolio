import Image from 'next/image';
import { Award, Building2, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface CertificateData {
  title: string;
  issuer: string;
  issuedDate: string;
  url: string;
  previewImage?: string;
  logo: string;
}

const certificates: CertificateData[] = [
  {
    title: "Business Analytics for Decision Making",
    issuer: "University of Colorado Boulder",
    issuedDate: "Jul 2025",
    url: "https://www.coursera.org/account/accomplishments/verify/2PN8Q00EPIOC",
    previewImage: "https://s3.amazonaws.com/coursera_assets/meta_images/generated/CERTIFICATE_LANDING_PAGE/CERTIFICATE_LANDING_PAGE~2PN8Q00EPIOC/CERTIFICATE_LANDING_PAGE~2PN8Q00EPIOC.jpeg",
    logo: "/logos/cuboulder.png"
  },
  {
    title: "AI-Powered Business Analytics (Intermediate)",
    issuer: "National University of Singapore",
    issuedDate: "Jun 2025", 
    url: "https://credentials.nus.edu.sg/3c2fa566-3bb9-4401-9b4b-93c4b7b7f8bb",
    previewImage: "https://image.thum.io/get/width/400/crop/240/noanimate/wait/10/https://credentials.nus.edu.sg/3c2fa566-3bb9-4401-9b4b-93c4b7b7f8bb",
    logo: "/logos/nus.png"
  },
  {
    title: "Strategy and Game Theory for Management",
    issuer: "IIM Ahmedabad",
    issuedDate: "Apr 2025",
    url: "https://www.coursera.org/account/accomplishments/verify/8MCNN6YNELCI",
    previewImage: "https://s3.amazonaws.com/coursera_assets/meta_images/generated/CERTIFICATE_LANDING_PAGE/CERTIFICATE_LANDING_PAGE~8MCNN6YNELCI/CERTIFICATE_LANDING_PAGE~8MCNN6YNELCI.jpeg",
    logo: "/logos/iim.png"
  }
];

function CertificatePreview({ cert }: { cert: CertificateData }) {
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
    if (issuer.includes('Colorado')) return 'from-[#d4af37] to-[#b8941f]';
    if (issuer.includes('Singapore')) return 'from-[#00b9fc] to-[#0099d4]';
    if (issuer.includes('IIM')) return 'from-[#d4af37] to-[#00b9fc]';
    return 'from-[#00b9fc] to-[#d4af37]';
  };
  
  const getInstitutionIcon = (issuer: string) => {
    if (issuer.includes('Colorado')) return <GraduationCap size={32} />;
    if (issuer.includes('Singapore')) return <Building2 size={32} />;
    if (issuer.includes('IIM')) return <Award size={32} />;
    return <GraduationCap size={32} />;
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
          <div className="mb-2 flex justify-center">
            {getInstitutionIcon(cert.issuer)}
          </div>
          <div className="font-bold text-sm leading-tight mb-1 body-text-medium">
            {cert.title.split(' ').slice(0, 3).join(' ')}
          </div>
          <div className="text-xs opacity-90 font-medium body-text">
            {cert.issuer.split(' ').slice(0, 2).join(' ')}
          </div>
          <div className="text-xs opacity-75 mt-1 body-text">
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {certificates.map((cert, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="cert-card p-6"
        >
          {/* Certificate Header with Logo */}
          <div className="flex items-center gap-2 mb-2">
            <Image 
              src={cert.logo} 
              alt={cert.issuer} 
              width={28} 
              height={28} 
              className="rounded-full"
              onError={(e) => {
                // Fallback to institution icon if logo fails
                const target = e.target as HTMLElement;
                target.style.display = 'none';
              }}
            />
            <h3 className="text-lg font-semibold text-white">{cert.title}</h3>
          </div>

          {/* Certificate Preview */}
          <CertificatePreview cert={cert} />

          {/* Certificate Metadata */}
          <p className="text-sm text-gray-400 mb-4">
            {cert.issuer} • <span className="text-gray-500">{cert.issuedDate}</span>
          </p>

          {/* View Certificate Button */}
          <a 
            href={cert.url} 
            target="_blank" 
            rel="noreferrer"
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 transition-all shadow-md hover:shadow-blue-400/50"
          >
            <svg width="16" height="16" fill="currentColor" className="opacity-90">
              <path d="M10 3l5 5-5 5M15 8H3"/>
            </svg>
            View Certificate
          </a>
        </motion.div>
      ))}
    </div>
  );
}
