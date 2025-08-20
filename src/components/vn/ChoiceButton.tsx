"use client";
import { motion } from "framer-motion";

export default function ChoiceButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="btn w-full text-left"
    >
      {label}
    </motion.button>
  );
}
