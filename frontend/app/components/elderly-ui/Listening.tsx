type Props = {
    onStop: () => void;
};

export default function Listening({ onStop }: Props) {
    return (
        <div className="flex flex-col items-center justify-center mt-80 ">
            <button
                className="bg-teal-600 flex items-center justify-center size-90 text-white text-5xl font-bold rounded-full"
                onClick={onStop}
            >
                Stop
            </button>
        </div>
    );
}
