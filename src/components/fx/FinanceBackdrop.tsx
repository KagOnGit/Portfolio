"use client";

import { motion } from "framer-motion";

export default function FinanceBackdrop() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Finance grid pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="finance-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="rgba(0,185,252,0.1)"
                strokeWidth="0.5"
              />
            </pattern>
            <pattern id="finance-dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="0.5" fill="rgba(212,175,55,0.2)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#finance-grid)" />
          <rect width="100%" height="100%" fill="url(#finance-dots)" />
        </svg>
      </div>

      {/* Subtle candlestick pattern overlay */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <motion.div
          className="flex items-end justify-center h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2 mx-1 bg-gradient-to-t from-[#00b9fc] to-transparent"
              style={{
                height: `${Math.random() * 40 + 10}%`,
              }}
              initial={{ height: 0 }}
              animate={{ 
                height: `${Math.random() * 40 + 10}%`,
              }}
              transition={{ 
                duration: 3,
                delay: i * 0.1,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 5
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00b9fc]/5 via-transparent to-[#d4af37]/5" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-slate-900/50" />
    </div>
  );
}
