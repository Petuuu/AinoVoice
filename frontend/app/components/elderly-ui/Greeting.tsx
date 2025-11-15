import { useState, useEffect } from 'react';

type Props = {
    listening: boolean
};

export default function Greeting({ listening }: Props) {
    const array = ["A", "B", "C"]
    const [randomElement, setRandomElement] = useState<string>();

    useEffect(() => {
        setRandomElement(array[Math.floor(Math.random() * array.length)]);
    }, [])

    return (
        <div className="flex justify-center mt-40">
            <p className="text-6xl font-bold">
                {listening
                    ? "listening..."
                    : randomElement
                }
            </p>
        </div>
    );
}