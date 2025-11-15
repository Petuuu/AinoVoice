import { useState, useEffect } from 'react';

type Props = {
    listening: boolean
};

export default function Greeting({ listening }: Props) {
    const [greetings, setGreetings] = useState<string[]>([]);
    const [greeting, setGreeting] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetch('/greetings.json')
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch greetings');
                return response.json();
            })
            .then((data) => {
                if (cancelled) return;
                setGreetings(data);
                setGreeting(data[Math.floor(Math.random() * data.length)]);
            })
            .catch(error => console.error('Error fetching greetings:', error));

        return () => { cancelled = true };
    }, [])

    return (
        <div className="flex justify-center mt-40">
            <p className="text-5xl font-bold">
                {listening
                    ? "Listening..."
                    : (greeting)
                }
            </p>
        </div>
    );
}