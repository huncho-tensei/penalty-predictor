"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import quotes from "@/data/quotes.json";

type FootballerQuoteProps = {
  minimized: boolean;
};

export default function FootballerQuote({ minimized }: FootballerQuoteProps) {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <motion.div
      layout
      className={`font-noto italic text-foreground/40 ${
        minimized
          ? "fixed bottom-4 right-4 max-w-[250px] text-xs text-right"
          : "max-w-[500px] text-center text-sm mt-4"
      }`}
      transition={{ layout: { duration: 0.6, ease: "easeInOut" } }}
    >
      <motion.p layout="position">
        &ldquo;{quote.text}&rdquo;
      </motion.p>
      <motion.p layout="position" className="text-foreground/25 mt-1 not-italic">
        — {quote.author}
      </motion.p>
    </motion.div>
  );
}
