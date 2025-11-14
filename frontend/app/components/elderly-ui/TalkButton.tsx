"use client";

import type { FormEvent } from 'react';

export default function TalkButton() {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert("Start listening");
    }

    return (
        <form onSubmit={handleSubmit}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white text-5xl font-bold py-4 px-6 rounded">
                Talk to your companion
            </button>
        </form>
    );
}