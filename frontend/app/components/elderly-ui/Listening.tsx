import MicRecorder from "mic-recorder-to-mp3";

const recorder = new MicRecorder({ bitRate: 128 });

type Props = {
    onStop: () => void;
};

export default function Listening({ onStop }: Props) {
    const handleClick = async () => {
        recorder.stop();
        const [buffer, blob]: [ArrayBuffer[], Blob] = await recorder.getMp3();
        const file = new File(buffer, "audio.mp3", { type: blob.type });
        fetch("/api/checkin/voice", {
            method: 'POST',
            body: file,
            headers: { 'Content-Type': 'audio/mpeg' },
        });
        onStop();
    };
    return (
        <button
            className="bg-teal-600 flex items-center justify-center size-90 text-white text-5xl font-bold rounded-full"
            onClick={handleClick}
        >
            Stop
        </button>
    );
}
