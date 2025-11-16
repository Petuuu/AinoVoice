"use client";

import { useState, useRef, useEffect } from 'react';
import Greeting from './Greeting';
import TalkButton from './TalkButton';
import Listening from './Listening';
import ModeButton from '../shared/ModeButton';
import MicRecorder from "mic-recorder-to-mp3";

const recorder = new MicRecorder({ bitRate: 128 });

type Props = {
  changeMode: () => void
};

type AlertData = {
    mood_level: number;
    energy_level: number;
    loneliness_level: number;
    risk_level: number;
    summary: string;
}

const mock = {
    "risk_level": 0
}

export default function Elderly({ changeMode }: Props) {
    const [alerts, setAlerts] = useState<AlertData[]>([]);
    const [loading, setLoading] = useState(true);
    const [listening, setListening] = useState<boolean>(false);
    const [thinking, setThinking] = useState<boolean>(false);
    const listeningRef = useRef(false);
    const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

    useEffect(() => {
        async function fetchAlerts() {
            try {
                const res = await fetch('http://127.0.0.1:8000/classifications/');
                if (!res.ok) throw new Error('Failed to fetch alerts');

                const data: AlertData[] = await res.json();

                if (!data || data.length === 0) {
                    setAlerts([]);
                } else {
                    setAlerts(data);
                }

            } catch (err) {
                console.error(err);
                setAlerts([]);
            } finally {
                setLoading(false);
            }
        }

        fetchAlerts();
    }, []);

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
            setListening(false);
            listeningRef.current = false;
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
            setThinking(false);
        });
    }).catch((e: any) => {
        console.error("recorder.getMp3() failed:", e);
        setThinking(false);
    });
};

    return (
        <div className='min-h-screen bg-gray-50 text-gray-900 flex justify-center px-4 py-8'>
            <div className='w-full max-w-lg flex flex-col gap-8'>
                <header className='flex items-center justify-between'>
                    <div>
                        <h1 className="text-3xl font-bold"> AinoVoice Companion </h1>
                        <p className='text-gray-500 mt-1 text-sm'>A gentle daily voice check-in</p>
                    </div>
                    <ModeButton changeMode={changeMode} />
                </header>
                <div className='bg-white shadow-sm border border-gray-200 rounded-3xl p-8 flex flex-col items-center gap-6'>
                    <div className='w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-4xl'>🕊️</div>
                        <div className='text-center'>
                            <Greeting listening={listening}/>
                            <p>Press the button and tell me how you're going today.</p>
                            {thinking
                                ? <div
                                className="flex justify-center mt-6 text-3xl font-semibold text-gray-700 animate-pulse"
                                aria-live="polite"
                                >
                                    Thinking with you...
                                </div>
                                : null
                            }
                        </div>
                        <div className='relative flex items-center justify-center size-40 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg transition-all'>
                            {listening
                                ? <Listening onStop={stopListening} />
                                : <TalkButton onStart={startListening} />
                            }
                        </div>
                        <p className='text-lg font-medium'>Press to talk</p>
                        <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm'>
                            {
                                {
                                    0: <span className="bg-green-100 text-green-700">You seem well today</span>,
                                    1: <span className="bg-orange-100 text-orange-700">You seem a bit down today</span>,
                                    2: <span className="bg-red-100 text-red-700">You don't seem great at all today</span>,
                                }[mock.risk_level] ?? null
                            }
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4'>
                            <div className='bg-gray-50 border border-gray-200 rounded-2xl p-4'>
                                <p className='text-xs uppercase tracking-wide text-gray-500 mb-1'>You said </p>
                                <p className='text-gray-800 text-sm'>Your last message will appear here.</p>
                            </div>
                            <div className='bg-gray-50 border border-gray-200 rounded-2xl p-4'>
                                <p className='text-xs uppercase tracking-wide text-gray-500 mb-1'>Companion replied </p>
                                <p className='text-gray-800 text-sm'>My reply will appear here.</p>
                            </div>
                        </div>
            </div>
        </div>
    </div>
    );
};