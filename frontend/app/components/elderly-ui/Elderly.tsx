"use client"

import { useState } from 'react';
import IntroText from './IntroText';
import TalkButton from './TalkButton';
import Listening from './Listening';


export default function Elderly() {
    const [listening, setListening] = useState(false);

    return (
        <div>
            <h1 className="text-7xl font-bold"> Check-in companion </h1>
            <IntroText listening={listening} />

            <div className="flex flex-col items-center justify-center mt-30 ">
                {listening
                    ? <Listening onStop={() => setListening(false)} />
                    : <TalkButton onStart={() => setListening(true)} />
                }
            </div>
        </div>
    );
}