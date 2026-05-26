"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import quotes from "@/data/quotes.json";

export default function FootballerQuote({ minimized }: { minimized: boolean }) {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  if (minimized) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="max-w-[480px] text-center font-noto italic text-foreground/35 text-sm"
    >
      <p>&ldquo;{quote.text}&rdquo;</p>
      <p className="text-foreground/20 mt-1 not-italic">— {quote.author}</p>
    </motion.div>
  );
}
