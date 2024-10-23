"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { getArchivedBootstrap, getBootstrapFromStorage, getFixtures } from "@/services";
import AppSpinner from "./AppSpinner";
import AppFailedToFetch from "./AppFailedToFetch";
import { getExpectedPoints, getTeamLogoUrl, previousSeason } from "@/utils";
import Image from "next/image";

const separateByPosition = [
    // { label: "FWD",  filter: (el: any) => el.element_type == 4 && el.minutes > 90 && Number(el.points_per_game) > 5, fill: '#8884d8' },
    { label: "MID", filter: (el:any) => el.element_type == 3, fill: '#82ca9d'},
    // { label: "DEF",  filter: (el: any) => el.element_type == 2 && el.minutes > 90 && Number(el.points_per_game) > 3, fill: '#ff5b00' },
    // { label: "GKP", filter: (el:any) => el.element_type == 1 && el.minutes > 90 && Number(el.points_per_game) > 2, fill: '#ff00ff'}
]


const separateByTeam = [
    { label: "ARS",  filter: (el: any) => el.team_code == 3, fill: '#EF0107', code: 3 },
    { label: "AVL", filter: (el:any) => el.team_code == 7, fill: '#670e36', code: 7 },
    { label: "BOU", filter: (el:any) => el.team_code == 91, fill: '#DA291C', code: 91 },
    { label: "BRE",  filter: (el: any) => el.team_code == 94, fill: '#EF0007', code: 94 },
    { label: "BHA", filter: (el:any) => el.team_code == 36, fill: '#0057B8', code: 36 },
    { label: "CHE", filter: (el:any) => el.team_code == 88, fill: '#034694', code: 88 },
]

function AppScatterPlot({ dataSeparation }: any) {
  const { data: bootstrap, isLoading, error } = useQuery({
    queryKey: ["bootstrap"],
    queryFn: async () => await getBootstrapFromStorage()
  });

  const { data: bootstrapHist, isLoading: isLoadingHist, error: errorHist } = useQuery({
    queryKey: ["bootstrapHist"],
    queryFn: async () => await getArchivedBootstrap(previousSeason)
  });

  const { data: fixtures, isLoading: isLoadingFixtures, error: errorFixtures } = useQuery({
    queryKey: ["fixtures"],
    queryFn: async () => await getFixtures()
  });

  if (isLoading || isLoadingHist || isLoadingFixtures) {
    return (
      <div className="flex justify-center items-center h-screen">
        <AppSpinner />
      </div>
    );
  }
  if (error || errorHist || errorFixtures) {
    return (
      <div className="flex justify-center items-center h-screen">
        <AppFailedToFetch />
      </div>
    );
  }

  const getElementsWithXP = () => bootstrap && bootstrapHist && bootstrap?.elements?.map((el: any) => {
    return {
        ...el, 
        xp: getExpectedPoints(
            el,
            bootstrap?.events.find((evt: any) => evt.is_current)?.id,
            0,
            fixtures,
            bootstrap?.teams,
            bootstrapHist?.elements.find((elh: any) => elh.code == el.code),
          ),
    }
  }) || []
  
  return (
    <ResponsiveContainer height="80%" width="100%">
        <ScatterChart
        width={700}
        height={700}
        margin={{
            top: 20,
            right: 20,
            bottom: 10,
            left: 10,
        }}
        >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="points_per_game" type="number" name="Points per Game" unit="pts/game" />
        <YAxis dataKey="xp" type="number" name="expected points" unit="xP" />
        
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Legend />
        {(dataSeparation || separateByPosition).map((obj: any) => (
            <Scatter key={obj.label} name={obj.label} data={getElementsWithXP().filter(obj.filter)} fill={obj.fill}>
                <LabelList dataKey="web_name" position="right"/>
            </Scatter>
        ))}
        </ScatterChart>
    </ResponsiveContainer>
  );
}

export default AppScatterPlot;