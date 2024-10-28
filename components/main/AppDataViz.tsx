'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppScatterPlot from "./AppScatterPlot";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const queryClient = new QueryClient();
const AppDataViz = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <DataVizContent />
        </QueryClientProvider>
    )
}

const dataXPpg = { dataKey: "points_per_game", type: "number", name: "pts/game", unit: "pts/game" };
const dataXCurr = { dataKey: "event_points", type: "number", name: "Event Points", unit: "Pts" };
const dataY = { dataKey: "xp", type: "number", name: "xP", unit: "xP" };

const DataVizContent = () => {
    const [separateByPosition, setSeparateByPosition] = useState<any>([]);
    const [separateByPosition2, setSeparateByPosition2] = useState<any>([]);
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
        if (separateByPosition2.length === 0) {
            setSeparateByPosition2(
                [
                    { label: "FWD",  filter: (el: any) => el.element_type == 4 && el.minutes > 90 && Number(el.event_points) > 5, fill: '#8884d8' },
                    { label: "MID", filter: (el:any) => el.element_type == 3 && el.minutes > 90 && Number(el.event_points) > 5, fill: '#82ca9d'},
                    { label: "DEF",  filter: (el: any) => el.element_type == 2 && el.minutes > 90 && Number(el.event_points) > 3, fill: '#ff5b00' },
                    { label: "GKP", filter: (el:any) => el.element_type == 1 && el.minutes > 90 && Number(el.event_points) > 2, fill: '#ff00ff'}
                ]
            )
        }
    })
    return (
        <div className="w-11/12 md:w-5/12">
            <h1 className="text-2xl font-bold">Points per Game / Current Event Points vs Expected Points</h1>
            <Tabs defaultValue="ppg" className="w-full h-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ppg">Points/Game</TabsTrigger>
                    <TabsTrigger value="event_points">Current Point</TabsTrigger>
                </TabsList>
                <TabsContent
                    value="ppg"
                    className="flex flex-col items-center w-full"
                >
                    <AppScatterPlot dataSeparation={separateByPosition} dataX={dataXPpg} dataY={dataY}/>
                </TabsContent>
                <TabsContent value="event_points">
                    <AppScatterPlot dataSeparation={separateByPosition2} dataX={dataXCurr} dataY={dataY}/>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default AppDataViz;