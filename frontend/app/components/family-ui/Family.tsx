import Alert from './Alert';
import ModeButton from '../shared/ModeButton';

type Props = {
    changeMode: () => void;
}

export default function Family({changeMode}: Props) {
    return (
        <div>
            <h1 className="text-6xl font-bold p-5"> Family dashboard </h1>

            {/* for alert in alerts (database?), print alert */}
            <Alert mood={2} energy={2} loneliness={2} risk={2} summary="User fell in the woods and is in pain with low mood and energy but not feeling lonely; high risk due to the fall" />

            <ModeButton changeMode={changeMode} />
        </div>
    );
}