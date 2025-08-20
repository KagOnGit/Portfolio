import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface Achievement {
  title: string;
  date: string;
  image: string;
  caption: string;
}

const achievements: Achievement[] = [
  {
    title: "Sangeet Bhushan Part 2 (2nd Year)",
    date: "April 30, 2015",
    image: "/certificates/sangeet-bhushan-part2.jpg",
    caption: "Awarded Certificate of Sangeet Bhushan Part 2 in Flute (Classical), First Division with Distinction"
  },
  {
    title: "Sangeet Bhushan Final (3rd Year)",
    date: "April 3, 2016", 
    image: "/certificates/sangeet-bhushan-final.jpg",
    caption: "Awarded Certificate of Sangeet Bhushan Final in Flute (Classical), First Division with Distinction"
  },
  {
    title: "Sangeet Visharad Part 1 (4th Year)",
    date: "May 31, 2017",
    image: "/certificates/sangeet-visharad.jpg",
    caption: "Diploma of Sangeet Visharad Part 1 in Flute (Classical), First Division with Distinction"
  },
  {
    title: "APN Student of the Year – Budding Talent Award",
    date: "December 16, 2017",
    image: "/certificates/apn-student-of-year.jpg",
    caption: "Recognized as Student of the Year 2017, Modern School Barakhamba Road, New Delhi"
  }
];

function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="cert-card p-6 hover:scale-[1.02] transition-all duration-300">
        {/* Certificate Image */}
        <div className="relative aspect-[4/3] w-full mb-4 rounded-lg overflow-hidden bg-gray-900">
          {!imageError ? (
            <Image
              src={achievement.image}
              alt={achievement.title}
              fill
              className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-900/20 to-blue-600/20">
              <div className="text-center p-4">
                <div className="text-4xl mb-2">🏆</div>
                <div className="text-sm text-white/70">{achievement.title}</div>
              </div>
            </div>
          )}
          
          {/* Loading indicator */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Date overlay */}
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-white/90">
            {achievement.date}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {achievement.title}
        </h3>

        {/* Caption */}
        <p className="text-sm text-gray-400 leading-relaxed">
          {achievement.caption}
        </p>
      </div>
    </motion.div>
  );
}

export default function ExtracurricularAchievements() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {achievements.map((achievement, index) => (
        <AchievementCard 
          key={index} 
          achievement={achievement} 
          index={index}
        />
      ))}
    </div>
  );
}
