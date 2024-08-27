import { ChevronDown, ChevronUp, Minus } from "lucide-react";


const PositionChanges = (props: any) => {
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
        return (<ChevronDown className="text-red-600 font-semibold w-6 h-6" />)
    } 
}

export default PositionChanges;