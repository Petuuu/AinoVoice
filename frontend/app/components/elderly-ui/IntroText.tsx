type Props = {
    listening: boolean
}

export default function IntroText({ listening }: Props) {
    return (
        <div className="flex justify-center mt-40">
            <p className="text-6xl font-bold">
                {listening
                ? "listening..."
                : "not listening"
                }
            </p>
        </div>
    )
}