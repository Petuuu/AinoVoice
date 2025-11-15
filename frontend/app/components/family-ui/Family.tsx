import ModeButton from '../shared/ModeButton';

type Props = {
    changeMode: () => void;
}

export default function Family({changeMode}: Props) {
    return (
        <div>
            <h1 className="text-6xl font-bold p-5"> Family dashboard </h1>
            <ModeButton changeMode={changeMode} />
        </div>
    );
}