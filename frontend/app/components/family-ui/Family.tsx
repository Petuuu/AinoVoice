import ModeButton from '../shared/ModeButton';

type Props = {
    changeMode: () => void;
}

export default function Family({changeMode}: Props) {
    return (
        <div>
            <h1 className="text-7xl font-bold"> Family dashboard </h1>
            <ModeButton changeMode={changeMode} />
        </div>
    );
}