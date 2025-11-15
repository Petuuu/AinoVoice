import MicRecorder from "mic-recorder-to-mp3";

const recorder = new MicRecorder({ bitRate: 128 });

type Props = {
    onStop: () => void;
};

export default function Listening({ onStop }: Props) {
    const handleClick = () => {
        recorder.stop().getMp3().then(([buffer, blob]: [ArrayBuffer[], Blob]) => {
            const file = new File(buffer, "recording.mp3", { type: blob.type});
            fetch("api/process-audio", {
                method: 'POST',
                body: file,
                headers : {'Content-Type': 'audio/mpeg'},
            });
            onStop();
        });
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
