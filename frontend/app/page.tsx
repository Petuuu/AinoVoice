import Elderly from './components/elderly-ui/Elderly';
import Family from './components/family-ui/Family';

import { useState } from 'react';

export default function Home() {
  const [mode, setMode] = useState<string>('elderly');

  return (
    <div className="m-3">
      <h1 className="text-7xl font-bold"> Check-in companion </h1>
        {mode == 'elderly'
          ? <Elderly changeMode={() => setMode('elderly')} />
          : <Family changeMode{() => setMode('family')} />
        }
    </div>
  );
}
