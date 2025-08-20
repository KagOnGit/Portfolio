"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import SceneWrapper from "@/components/vn/SceneWrapper";
import DialogBox from "@/components/vn/DialogBox";
import ChoiceButton from "@/components/vn/ChoiceButton";
import StatBar from "@/components/vn/StatBar";
import { chapters, START_CHAPTER, stats } from "@/data/story";

type Chapter = typeof chapters[keyof typeof chapters];

const STORAGE_KEY = "vn-progress";

export default function Page() {
  const [chapterId, setChapterId] = useState<string>(START_CHAPTER);
  const [sceneIndex, setSceneIndex] = useState<number>(0);

  const chapter: Chapter = useMemo(() => chapters[chapterId], [chapterId]);
  const scene = chapter.scenes[sceneIndex];

  // Load saved progress
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { chapterId: cId, sceneIndex: sIdx } = JSON.parse(raw);
        if (cId && chapters[cId]) {
          setChapterId(cId);
          setSceneIndex(typeof sIdx === "number" ? sIdx : 0);
        }
      }
    } catch {}
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ chapterId, sceneIndex }));
  }, [chapterId, sceneIndex]);

  const nextScene = () => {
    if (sceneIndex < chapter.scenes.length - 1) {
      setSceneIndex((i) => i + 1);
    }
  };

  const canAdvance = sceneIndex < chapter.scenes.length - 1;
  const showChoices = !canAdvance && chapter.choices && chapter.choices.length > 0;

  const handleChoice = (next: string) => {
    if (next === "link_deallens") {
      window.open("https://deal-lens-ai-ma-screener.vercel.app", "_blank");
    }
    if (next === "link_nus_cert") {
      window.open("https://credentials.nus.edu.sg/3c2fa566-3bb9-4401-9b4b-93c4b7b7f8bb#acc.Eb4QxwFr", "_blank");
    }
    if (next === "link_coursera_fin") {
      window.open("https://www.coursera.org/account/accomplishments/verify/2PN8Q00EPIOC", "_blank");
    }
    if (next === "link_coursera_ai") {
      window.open("https://www.coursera.org/account/accomplishments/verify/8MCNN6YNELCI", "_blank");
    }
    setChapterId(next in chapters ? next : START_CHAPTER);
    setSceneIndex(0);
  };

  return (
    <SceneWrapper onOpenDealLens={() => { /* optional analytics */ }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white/70">
          <span>Interactive Portfolio</span>
          <span>·</span>
          <span>Visual Novel Mode</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">{chapter.title}</h1>
        {chapter.tag && <div className="text-white/60 mt-1">{chapter.tag}</div>}
      </motion.div>

      {/* Scene text */}
      <div>
        <DialogBox key={scene.id} text={scene.text} speaker={scene.speaker} />

        {/* Advance button if scenes remain */}
        {canAdvance && (
          <div className="mt-4">
            <button onClick={nextScene} className="btn w-full">Continue</button>
          </div>
        )}

        {/* Choices */}
        {showChoices && (
          <div className="mt-6 grid gap-2">
            {chapter.choices!.map((c) => (
              <ChoiceButton key={c.label} label={c.label} onClick={() => handleChoice(c.next)} />
            ))}
          </div>
        )}

        {/* Stats section when on 'stats' chapter */}
        {chapterId === "stats" && (
          <div className="v-card mt-6">
            <h2 className="text-lg font-semibold mb-4">Skills & Attributes</h2>
            {stats.map(({ label, value }) => (
              <StatBar key={label} label={label} value={value} />
            ))}
            <div className="text-sm text-white/60 mt-3">
              Actively growing: CFA L1 prep, financial modeling, and IB tech workflows.
            </div>
          </div>
        )}

        {/* Quick contact card */}
        <div className="v-card mt-6 text-sm text-white/80">
          <div>Contact: <a href="mailto:adityasingh0929@gmail.com">adityasingh0929@gmail.com</a> · <a href="tel:+919818722103">+91 98187 22103</a></div>
          <div>More: <a href="https://github.com/KagOnGit" target="_blank" rel="noreferrer">GitHub</a> · <a href="https://www.linkedin.com/in/aditya-singh-9b1193261" target="_blank" rel="noreferrer">LinkedIn</a></div>
        </div>
      </div>
    </SceneWrapper>
  );
}
