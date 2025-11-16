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

        return () => { cancelled = true };
    }, [])

    return (
        <div className="flex justify-center">
            <p className="text-4xl font-bold">
                {listening
                    ? "Listening..."
                    : (greeting)
                }
            </p>
        </div>
    );
}