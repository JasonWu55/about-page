"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

interface TypingEffectProps {
  texts?: string[];
  className?: string;
  rotationInterval?: number;
  typingSpeed?: number;
  /** If true, type the first text once and stop — cursor keeps blinking */
  once?: boolean;
}

export function TypingEffect({
  texts = ["Jason"],
  className,
  rotationInterval = 3000,
  typingSpeed = 120,
  once = false,
}: TypingEffectProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  const currentText = texts[currentTextIndex % texts.length];

  useEffect(() => {
    if (!isInView) return;
    if (done) return;

    if (charIndex < currentText.length) {
      const t = setTimeout(() => {
        setDisplayedText((prev) => prev + currentText.charAt(charIndex));
        setCharIndex((i) => i + 1);
      }, typingSpeed);
      return () => clearTimeout(t);
    } else {
      // Finished typing current text
      if (once || texts.length === 1) {
        setDone(true);
        return;
      }
      const t = setTimeout(() => {
        setDisplayedText("");
        setCharIndex(0);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      }, rotationInterval);
      return () => clearTimeout(t);
    }
  }, [charIndex, currentText, isInView, done, once, texts.length, rotationInterval, typingSpeed]);

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-flex items-center justify-center", className)}
    >
      {displayedText}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        className="ml-[0.05em] inline-block h-[0.85em] w-[3px] rounded-sm bg-current align-middle"
      />
    </div>
  );
}

export default TypingEffect;
