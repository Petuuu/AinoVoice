import { useEffect, useState } from 'react';
import Alert from './Alert';
import ModeButton from '../shared/ModeButton';

type Props = {
    changeMode: () => void;
}

type AlertData = {
    mood_level: number;
    energy_level: number;
    loneliness_level: number;
    risk_level: number;
    summary: string;
}

export default function Family({ changeMode }: Props) {
    const [alerts, setAlerts] = useState<AlertData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAlerts() {
            try {
                const res = await fetch('http://127.0.0.1:8000/classifications/');
                if (!res.ok) throw new Error('Failed to fetch alerts');
                const data: AlertData[] = await res.json();
                setAlerts(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchAlerts();
    }, []);

    return (
        <div>
            <h1 className="text-6xl font-bold p-5">Family Dashboard</h1>

            {loading && <p>Loading alerts...</p>}

            {!loading && alerts.length === 0 && (
                <p>No alerts</p>
            )}

            {!loading && alerts.length > 0 && (
                alerts.map(a => (
                    <Alert
                        mood={a.mood_level}
                        energy={a.energy_level}
                        loneliness={a.loneliness_level}
                        risk={a.risk_level}
                        summary={a.summary}
                    />
                ))
            )}

            <ModeButton changeMode={changeMode} />
        </div>
    );
}