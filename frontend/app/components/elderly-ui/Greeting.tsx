"use client";

import { useState, useEffect } from 'react';

type Props = {
  listening: boolean;
  thinking?: boolean; // optional; defaults to false
};

export default function Greeting({ listening, thinking = false }: Props) {
  const [greetings, setGreetings] = useState<string[]>([]);
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/greetings.json')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch greetings');
        return response.json();
      })
      .then((data: string[]) => {
        if (cancelled) return;
        setGreetings(data);
        setGreeting(data[Math.floor(Math.random() * data.length)]);
      })
      .catch(error => console.error('Error fetching greetings:', error));

    return () => { cancelled = true; };
  }, []);

  const displayText = listening
    ? "Listening..."
    : thinking
      ? "AI is thinking..."
      : greeting ?? "";

  return (
    <div className="flex justify-center mt-40" aria-live="polite">
      <p className={`text-5xl font-bold ${thinking && !listening ? "animate-pulse" : ""}`}>
        {displayText}
      </p>
    </div>
  );
}