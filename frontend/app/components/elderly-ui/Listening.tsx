type Props = {
    onStop: () => void;
};

export default function Listening({ onStop }: Props) {
    return (
        <div className="flex justify-center">
            <span className="relative flex size-90">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#71B04F] opacity-75"></span>
                <span className="relative inline-flex size-90 rounded-full bg-[#71B04F] items-center justify-center">
                    <button
                        className="text-white text-5xl font-bold rounded-full size-90 flex items-center justify-center"
                        onClick={onStop}
                    >
                        Stop
                    </button>
                </span>
            </span>
        </div>
    );
}
