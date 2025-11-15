"use client"

import { useState } from 'react';
import TalkButton from "./TalkButton"
import Listening from "./Listening"


export default function Elderly() {
    const [listening, setListening] = useState(false);

    if (listening) {
        return (
            <div>
                <h1 className="text-7xl font-bold"> Check-in companion </h1>
                <Listening onStop={() => setListening(false)} />
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-7xl font-bold"> Check-in companion </h1>
            <TalkButton onStart={() => setListening(true)} />
        </div>
    )
}