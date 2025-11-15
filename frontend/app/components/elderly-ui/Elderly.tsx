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

  const stopListening = async () => {
    if (!listeningRef.current) return;

    try {
      // Stop recording and get MP3
      const [buffer, blob] = await recorder.stop().getMp3() as [ArrayBuffer[], Blob];
      const file = new File(buffer as any, "audio.mp3", { type: blob.type });
      const form = new FormData();
      form.append('uploaded_file', file, 'audio.mp3');

      // Switch from Listening to Thinking (upload/processing in progress)
      setListening(false);
      listeningRef.current = false;
      setThinking(true);

      const res = await fetch(`${API_BASE}/api/checkin/voice`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const errTxt = await res.text().catch(() => "");
        console.error("Upload failed:", errTxt || res.statusText);
        return;
      }

      const audio = new Audio("/speech.mp3");
      audio.autoplay = true;
      try {
        await audio.play();
      } catch (e) {
        console.error("autoplay failed:", e);
      }
    } catch (e) {
      console.error("stop flow error:", e);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div>
      <h1 className="text-7xl font-bold"> Check-in companion </h1>

      <Greeting listening={listening} />

      {thinking && !listening && (
        <div
          className="flex justify-center mt-6 text-3xl font-semibold text-gray-700 animate-pulse"
          aria-live="polite"
        >
          AI is thinking…
        </div>
      )}

      <div className="flex flex-col items-center justify-center mt-30">
        {listening
          ? <Listening onStop={stopListening} />
          : <TalkButton onStart={startListening} />
        }
      </div>

      <ModeButton changeMode={changeMode} />
    </div>
  );
}