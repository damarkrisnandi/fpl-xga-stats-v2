'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppScatterPlot from "./AppScatterPlot";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();
const AppDataViz = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <DataVizContent />
        </QueryClientProvider>
    )
}
const DataVizContent = () => {
    const [separateByPosition, setSeparateByPosition] = useState<any>([]);
    useEffect(() => {
        if (separateByPosition.length === 0) {
            setSeparateByPosition(
                [
                    { label: "FWD",  filter: (el: any) => el.element_type == 4 && el.minutes > 90 && Number(el.points_per_game) > 5, fill: '#8884d8' },
                    { label: "MID", filter: (el:any) => el.element_type == 3 && el.minutes > 90 && Number(el.points_per_game) > 5, fill: '#82ca9d'},
                    { label: "DEF",  filter: (el: any) => el.element_type == 2 && el.minutes > 90 && Number(el.points_per_game) > 3, fill: '#ff5b00' },
                    { label: "GKP", filter: (el:any) => el.element_type == 1 && el.minutes > 90 && Number(el.points_per_game) > 2, fill: '#ff00ff'}
                ]
            )
        }
    })
    return (
        <div className="w-11/12 md:w-5/12">
            <h1 className="text-2xl font-bold">Points per Game vs Expected Points</h1>
            <AppScatterPlot dataSeparation={separateByPosition}/>
        </div>
    )
}

export default AppDataViz;