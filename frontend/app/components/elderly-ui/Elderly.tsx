import { useState } from 'react';
import Greeting from './Greeting';
import TalkButton from './TalkButton';
import Listening from './Listening';
import ModeButton from '../shared/ModeButton';

type Props = {
    changeMode: () => void
};

export default function Elderly({ changeMode }: Props) {
    const [listening, setListening] = useState<boolean>(false);

    return (
        <div>
            <h1 className="text-7xl font-bold"> Check-in companion </h1>

            <Greeting listening={listening} />

            <div className="flex flex-col items-center justify-center mt-30 ">
                {listening
                    ? <Listening onStop={() => setListening(false)} />
                    : <TalkButton onStart={() => setListening(true)} />
                }
            </div>

            <ModeButton changeMode={changeMode} />
        </div>
    );
}