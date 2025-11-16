type Props = {
    changeMode: () => void;
};

export default function ModeButton({ changeMode }: Props) {
    return (
        <div className="fixed bottom-6 right-6 z-50 px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-700">
            <button
                onClick={changeMode}
            >
                Mode
            </button>
        </div>
    );
}
