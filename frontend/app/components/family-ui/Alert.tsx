type Props = {
    mood: number,
    energy: number,
    loneliness: number,
    risk: number,
    summary: string
}

export default function Alert({ mood, energy, loneliness, risk, summary }: Props) {
    const colorMap: Record<number, string> = {
        1: "bg-orange-300",
        2: "bg-red-300",
    };

    if (risk in colorMap) {
        const color = colorMap[risk];

        return (
            <div className={`${color} w-150 min-h-50 border-solid border-2 p-10 m-8`}>
                <p className="pb-4"> {summary} </p>
                <ul className="flex gap-4">
                    <li> Mood: {mood}/3 </li>
                    <li> Energy: {energy}/3 </li>
                    <li> Loneliness: {loneliness}/3 </li>
                    <li> Risk: {risk}/2 </li>
                </ul>
            </div>
        )

    };
    return;
}