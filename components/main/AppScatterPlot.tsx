"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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
import { getExpectedPoints, previousSeason } from "@/utils";

const data01 = [
  {
    "x": 100,
    "y": 200,
    "z": 200,
  },
  {
    "x": 120,
    "y": 100,
    "z": 260,
  },
  {
    "x": 170,
    "y": 300,
    "z": 400,
  },
  {
    "x": 140,
    "y": 250,
    "z": 280,
  },
  {
    "x": 150,
    "y": 400,
    "z": 500,
  },
  {
    "x": 110,
    "y": 280,
    "z": 200,
  },
];
const data02 = [
  {
    "x": 200,
    "y": 260,
    "z": 240,
  },
  {
    "x": 240,
    "y": 290,
    "z": 220,
  },
  {
    "x": 190,
    "y": 290,
    "z": 250,
  },
  {
    "x": 198,
    "y": 250,
    "z": 210,
  },
  {
    "x": 180,
    "y": 280,
    "z": 260,
  },
  {
    "x": 210,
    "y": 220,
    "z": 230,
  },
];

function AppScatterPlot() {
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

  const getElementsWithXP = () => bootstrap && bootstrapHist && bootstrap.elements.map((el: any) => {
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
  })
  
  return (
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
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="points_per_game" type="number" name="Points per Game" unit="pts/game" />
      <YAxis dataKey="xp" type="number" name="expected points" unit="xP" />
      <ZAxis
        dataKey="web_name"
      />
      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
      <Legend />
      <Scatter name="FWD" data={getElementsWithXP().filter((el: any) =>el.element_type == 4)} fill="#8884d8" />
      <Scatter name="MID" data={getElementsWithXP().filter((el: any) =>el.element_type == 3)} fill="#82ca9d" />
      <Scatter name="DEF" data={getElementsWithXP().filter((el: any) =>el.element_type == 2)} fill="#ff5b00" />
      <Scatter name="GKP" data={getElementsWithXP().filter((el: any) =>el.element_type == 1)} fill="#ff00ff" />
    </ScatterChart>
  );
}

export default AppScatterPlot;
