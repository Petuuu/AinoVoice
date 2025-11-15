type Props = {
    changeMode: () => void;
};

export default function ModeButton({ changeMode }: Props) {
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                className="bg-stone-500 hover:bg-stone-600 size-20 text-white rounded-full"
                onClick={changeMode}
            >
                Mode
            </button>
        </div>
    );
}