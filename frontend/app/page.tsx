"use client";

import Elderly from './components/elderly-ui/Elderly';
import Family from './components/family-ui/Family';

import { useState } from 'react';

export default function Home() {
  const [mode, setMode] = useState<string>('elderly');

  return (
    <div className="m-3">
        {mode == 'elderly'
          ? <Elderly changeMode={() => setMode('family')} />
          : <Family changeMode={() => setMode('elderly')} />
        }
    </div>
  );
}
