'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppScatterPlot from "./AppScatterPlot";

const queryClient = new QueryClient();
const AppDataViz = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <DataVizContent />
        </QueryClientProvider>
    )
}
const DataVizContent = () => {
    return (
        <div className="w-11/12 md:w-5/12">
            <h1 className="text-2xl font-bold">Points per Game vs Expected Points</h1>
            <AppScatterPlot />
        </div>
    )
}

export default AppDataViz;