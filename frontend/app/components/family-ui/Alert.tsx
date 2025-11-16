type Props = {
    mood: number,
    energy: number,
    loneliness: number,
    risk: number,
    summary: string
}

export default function Alert({ mood, energy, loneliness, risk, summary }: Props) {
    const colorMap: Record<number, string> = {
        0: "bg-green-100 border-green-300",
        1: "bg-amber-100 border-amber-300",
        2: "bg-red-100 border-red-300",
    };

    const riskLabel: Record<number, string> = {
        0: "Low risk",
        1: "Medium risk",
        2: "High risk",
    };

    const riskColor: Record<number, string> = {
        0: "text-green-700",
        1: "text-amber-700",
        2: "text-red-700",
    };

    const cardColor = colorMap[risk] || "bg-gray-100 border-gray-200";
    const labelColor = riskColor[risk] || "text-gray-700";

    return (
        <div className={`m-2 w-full border rounded-2xl p-5 flex flex-col gap-3 shadow-sm ${cardColor}`}>
            <div className="flex items-center gap-3 mb-2">
                {/* Icon based on risk */}
                {risk === 2 ? (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-200">
                        <svg className="w-5 h-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                    </span>
                ) : risk === 1 ? (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-200">
                        <svg className="w-5 h-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                    </span>
                ) : (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-200">
                        <svg className="w-5 h-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" /></svg>
                    </span>
                )}
                <span className={`font-semibold text-sm ${labelColor}`}>{riskLabel[risk] || "Unknown"}</span>
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-base font-medium text-gray-900">{summary}</p>
                <div className="flex gap-4 mt-1">
                    <span className="text-xs text-gray-500">Mood: <span className="font-semibold text-gray-700">{mood}</span></span>
                    <span className="text-xs text-gray-500">Energy: <span className="font-semibold text-gray-700">{energy}</span></span>
                    <span className="text-xs text-gray-500">Loneliness: <span className="font-semibold text-gray-700">{loneliness}</span></span>
                </div>
            </div>
        </div>
    );
}