import { ChevronDown, ChevronUp, Minus } from "lucide-react";
import PositionChanges from '@/components/main/PositionChange'

const PositionGains = (props: any) => {
    const { entry } = props;
    if (entry.last_rank == 0) {
        return (<Minus className="text-slate-700 font-semibold w-6 h-6"/>)
    }

    // gain position
    if (entry.rank < entry.last_rank) {
        return (<ChevronUp className="text-green-600 font-semibold w-6 h-6"/>)
    } else if (entry.rank == entry.last_rank) {
        return (<Minus className="text-slate-700 font-semibold w-6 h-6"/>)
    } else {
        // lost position
        return (<ChevronDown className="text-red-600 font-semibold w-2 h-2" />)
    } 
}

const AppTopStandings = (props: any) => {
  const { entry, value } = props;
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center space-x-2">
        <PositionChanges entry={entry}/>
        <p className="text-3xl font-semibold">1</p>
        <div>
          <p className="text-sm font-semibold">{entry.entry_name}</p>
          <p className="text-xs">{entry.player_name}</p>
        </div>
      </div>
      <p className="text-2xl font-semibold">{entry[value]}</p>
    </div>
  );
};

export default AppTopStandings