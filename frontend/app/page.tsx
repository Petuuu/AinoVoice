import Elderly from './components/elderly-ui/Elderly';
import Family from './components/family-ui/Family';

export default function Home() {
  return (
    <div className="m-3">
      <h1 className="text-7xl font-bold"> Check-in companion </h1>
      <Elderly />
    </div>
  );
}
