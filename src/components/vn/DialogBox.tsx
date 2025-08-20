"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function DialogBox({ text, speaker }: { text: string; speaker?: string }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setDisplay((prev) => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(id);
    }, 12);
    return () => clearInterval(id);
  }, [text]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="v-card mt-4"
    >
      {speaker && <div className="text-neon font-semibold mb-2">{speaker}</div>}
      <p className="leading-relaxed">{display}</p>
    </motion.div>
  );
}
