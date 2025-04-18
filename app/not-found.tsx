"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const emojis = ["🏋️‍♀️", "🏋️‍♂️"];

export default function NotFound() {
  const [emoji, setEmoji] = useState(emojis[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * emojis.length);
    setEmoji(emojis[randomIndex]);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)] p-6">
      <div className="text-center max-w-md">
        <div className="text-9xl mb-6 animate-bounce" aria-hidden="true">
          {emoji}
        </div>
        <h1 className="text-5xl font-extrabold mb-4 text-[var(--primary)]">
          404
        </h1>
        <p className="text-lg mb-6 text-[var(--foreground)] opacity-80">
          Oops! Looks like you lifted the wrong weight. This page doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold shadow-lg hover:bg-[var(--primary-foreground)] hover:text-[var(--primary)] transition-colors duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </main>
  );
}
