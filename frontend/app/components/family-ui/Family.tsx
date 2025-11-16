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
    const [solved, setSolved] = useState<Record<number, boolean>>({});

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
        <div className='min-h-screen bg-gray-50 text-gray-900 flex justify-center px-4 py-8'>
            <div className='w-full max-w-4xl flex flex-col gap-8'>
                <header className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
                    <div>
                        <h1 className='text-3xl font-bold'>AinoVoice Family Dashboard</h1>
                        <p className='text-gray-500 mt-1 text-sm'>See how your loved one is doing today, at a glance.</p>
                    </div>
                </header>
                <section className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3'>
                        <div className='flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </div>
                        <div>
                            <p className='text-xs uppercase tracking-wide text-gray-500'>Overall status</p>
                            <p className='text-sm font-medium text-gray-900'>Mood slightly low, but stable</p>
                        </div>
                    </div>
                    <div className='bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3'>
                        <div className='flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                        <div>
                            <p className='text-xs uppercase tracking-wide text-gray-500'>Last check-in</p>
                            <p className='text-sm font-medium text-gray-900'>Today at 7.32</p>
                        </div>
                    </div>
                <div className='bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3'>
                    <div className='flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-600'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                        </svg>
                    </div>
                    <div>
                        <p className='text-xs uppercase tracking-wide text-gray-500'>Attention level</p>
                        <p className='text-sm font-medium text-amber-700'>Check in today if possible</p>
                    </div>
                </div>
                </section>

                <section className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'>
                    <div className='p-10 lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4'>
                        <div className='flex items-center justify-between'>
                            <h2 className='text-lg font-semibold'>Recent alerts</h2>
                            <span className='text-xs text-gray-400'>Demo data</span>
                        </div>
                        <div className='flex flex-col gap-3'>
                            {loading && <p className='text-sm text-gray-500'>Loading alerts...</p>}
                            {!loading && alerts.length === 0 && (
                                <p className='text-sm text-gray-500'>No alerts</p>
                            )}
                            {!loading && alerts.length > 0 && (
                                alerts.map((a, i) => (
                                    <div
                                        key={`${a.summary}-${i}`}
                                        className={solved[i] ? "opacity-60 grayscale" : ""}
                                    >
                                        <div className="flex items-center gap-2 px-8 pt-2">
                                            <input
                                                id={`solved-${i}`}
                                                type="checkbox"
                                                className="h-5 w-5 accent-emerald-600"
                                                checked={!!solved[i]}
                                                onChange={(e) =>
                                                    setSolved((s) => ({ ...s, [i]: e.target.checked }))
                                                }
                                            />
                                            <label
                                                htmlFor={`solved-${i}`}
                                                className="text-sm text-gray-700 select-none"
                                            >
                                                {solved[i] ? "Solved" : "Mark solved"}
                                            </label>
                                        </div>

                                        <Alert
                                            mood={a.mood_level}
                                            energy={a.energy_level}
                                            loneliness={a.loneliness_level}
                                            risk={a.risk_level}
                                            summary={a.summary}
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className='bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-3'>
                    <h2 className='text-lg font-semibold'>
                        Last check-in
                    </h2>
                    <div className='bg-gray-50 border border-gray-200 rounded-2xl p-3'>
                        <p className='text-xs uppercase tracking-wide text-gray-500 mb-1'>Elder said</p>
                        <p className='text-sm text-gray-800'>“I feel a bit lonely today, but I’m okay. I stayed home and read a book.”</p>
                    </div>
                    <div className='bg-gray-50 border border-gray-200 rounded-2xl p-3'>
                        <p className='text-xs uppercase tracking-wide text-gray-500 mb-1'>AI summary</p>
                        <p className='text-sm text-gray-800'>“Mood slightly low, no acute risk. Encouraged gentle activity and reaching out to family.”</p>
                    </div>
                    </div>
                </section>
            </div>
            <ModeButton changeMode={changeMode} />
        </div>
    );
}