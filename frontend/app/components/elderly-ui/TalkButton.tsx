import MicRecorder from "mic-recorder-to-mp3";

const recorder = new MicRecorder({ bitRate: 128 })

type Props = {
    onStart: () => void
};

export default function TalkButton({ onStart }: Props) {
    const handleClick = () => {
        recorder.start()
            .then(() => {onStart()});
    };
    return (
        <button
            className="bg-blue-500 hover:bg-blue-700 size-90 text-white text-5xl font-bold rounded-full"
            onClick={handleClick}>
            Talk to<br />your companion
        </button>
    );
}