type Props = {
    onStart: () => void
};

export default function TalkButton({ onStart }: Props) {
    return (
        <button
            className="bg-[#8BBE6F] hover:bg-[#71B04F] size-90 text-[#D6E8CC] text-4xl font-bold rounded-full"
            onClick={onStart}>
            Talk to<br />your companion
        </button>
    );
}