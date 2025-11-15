"use client";

import { useState, useRef } from 'react';
import Greeting from './Greeting';
import TalkButton from './TalkButton';
import Listening from './Listening';
import ModeButton from '../shared/ModeButton';
import MicRecorder from "mic-recorder-to-mp3";

const recorder = new MicRecorder({ bitRate: 128 });

type Props = {
  changeMode: () => void
};

export default function Elderly({ changeMode }: Props) {
    const [listening, setListening] = useState<boolean>(false);
    const [thinking, setThinking] = useState<boolean>(false);
    const listeningRef = useRef(false);
    const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

    const startListening = () => {
      recorder.start()
          .then(() => {
              setListening(true);
              listeningRef.current = true;
          })
          .catch((e: any) => console.error("recorder.start() failed:", e));
    };


    const stopListening = () => {
        if (!listeningRef.current) return;

        setThinking(true);

        recorder.stop().getMp3().then(([buffer, blob]: [ArrayBuffer[], Blob]) => {
            const file = new File(buffer as any, "audio.mp3", { type: blob.type });
            const form = new FormData();
            form.append('uploaded_file', file, 'audio.mp3');

            fetch(`${API_BASE}/api/checkin/voice`, {
                method: "POST",
                body: form,
            })
            .then(async (res) => {
            if (res.ok) {
                const audio = new Audio("/speech.mp3");
                audio.autoplay = true;
                audio.play().catch(e => console.error("autoplay failed:", e));
            } else {
                console.log("error")
            }
        })
        .catch((e: any) => console.error("upload failed:", e))
        .finally(() => {
            setThinking(false);       // <-- keep here
            setListening(false);
            listeningRef.current = false;
        });
    }).catch((e: any) => {
        console.error("recorder.getMp3() failed:", e);
        setThinking(false); // <-- only needed here for errors
    });
};

    return (
        <div>
            <h1 className="text-6xl font-bold p-5"> Check-in companion </h1>
            <Greeting listening={listening} />

            {thinking
                ? <div
                  className="flex justify-center mt-6 text-3xl font-semibold text-gray-700 animate-pulse"
                  aria-live="polite"
                >
                    Thinking with you...
                </div>
                : null
            }

            <div className="flex flex-col items-center justify-center mt-10">
                {listening && !thinking
                    ? <Listening onStop={stopListening} />
                    : <TalkButton onStart={startListening} />
                 }
            </div>

            <ModeButton changeMode={changeMode} />
        </div>
    );
}