type Props = {
    onStart: () => void
};

export default function TalkButton({ onStart }: Props) {
    return (
        <button
            className="bg-blue-500 hover:bg-blue-700 size-90 text-white text-5xl font-bold rounded-full"
            onClick={onStart}>
            Talk to<br />your companion
        </button>
    );
}