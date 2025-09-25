"use client";

import {
  LabelList,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import useBootstrap from "@/hooks/use-bootstrap";
import useBootstrapHist from "@/hooks/use-bootstraphist";
import useFixtures from "@/hooks/use-fixtures";
import useLastFiveGw from "@/hooks/use-lastfivegw";
import { getExpectedPoints, previousSeason } from "@/utils";
import { useIsMobile } from "../../hooks/use-mobile";
import { Element } from "../../models/bootstrap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import AppFailedToFetch from "./AppFailedToFetch";

const separateByPosition = [
  // { label: "FWD",  filter: (el: any) => el.element_type == 4 && el.minutes > 90 && Number(el.points_per_game) > 5, fill: '#8884d8' },
  { label: "MID", filter: (el: any) => el.element_type == 3, fill: '#82ca9d' },
  // { label: "DEF",  filter: (el: any) => el.element_type == 2 && el.minutes > 90 && Number(el.points_per_game) > 3, fill: '#ff5b00' },
  // { label: "GKP", filter: (el:any) => el.element_type == 1 && el.minutes > 90 && Number(el.points_per_game) > 2, fill: '#ff00ff'}
]


const separateByTeam = [
  { label: "ARS", filter: (el: any) => el.team_code == 3, fill: '#EF0107', code: 3 },
  { label: "AVL", filter: (el: any) => el.team_code == 7, fill: '#670e36', code: 7 },
  { label: "BOU", filter: (el: any) => el.team_code == 91, fill: '#DA291C', code: 91 },
  { label: "BRE", filter: (el: any) => el.team_code == 94, fill: '#EF0007', code: 94 },
  { label: "BHA", filter: (el: any) => el.team_code == 36, fill: '#0057B8', code: 36 },
  { label: "CHE", filter: (el: any) => el.team_code == 88, fill: '#034694', code: 88 },
]

function AppScatterPlot({ dataSeparation, dataX, dataY }: any) {
  const { bootstrap, isLoadingBootstrap, errorBootstrap } = useBootstrap();
  const { bootstrapHist, isLoadingBootstrapHist, errorBootstrapHist } = useBootstrapHist({ season: previousSeason })
  const { fixtures, isLoadingFixtures, errorFixtures } = useFixtures()
  const { last5, isLoadingLast5, errorLast5 } = useLastFiveGw({ bootstrap, event: bootstrap?.events.find((evt: any) => evt.is_current), n: 5 });

  const isMobile = useIsMobile();

  if (isLoadingBootstrap || isLoadingBootstrapHist || isLoadingFixtures) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <LoaderContainer />
      </div>
    );
  }
  if (errorBootstrap || errorBootstrapHist || errorFixtures) {
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
        1,
        fixtures,
        bootstrap?.teams,
        bootstrapHist?.elements.find((elh: any) => elh.code == el.code),
        last5
      ).toFixed(2),
    }
  }) || []


  const PpGs = getElementsWithXP().map((el: Element) => Number(el.points_per_game)).filter((val: number) => !isNaN(val) && val !== null && val !== undefined)
  const xpo5s = getElementsWithXP().map((el: Element) => (el.xp ?? 0)).filter((val: number) => !isNaN(val) && val !== null && val !== undefined);
  const maxPpG = PpGs.length > 0 ? Math.max(...PpGs.map((ppg: number | string) => Number(ppg))) : 0
  const maxXpo5 = xpo5s.length > 0 ? Math.max(...xpo5s.map((ppg: number | string) => Number(ppg))) : 0

  const bound = Math.ceil(Math.max(maxPpG, maxXpo5));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className={isMobile ? "text-lg" : "text-xl"}>Point per game vs Expected points</CardTitle>
        <CardDescription className={isMobile ? "text-sm" : "text-base"}>
          Compare each player&apos;s actual points per game to their expected points based on recent performance.
        </CardDescription>
      </CardHeader>
      <CardContent className={`flex items-center justify-center`}>
        <ResponsiveContainer
          width="100%"
          height={'100%'}
          aspect={1.0 / 1.0}
        >
          <ScatterChart
            margin={
              isMobile
                ? { top: 20, right: 15, left: 10, bottom: 25 }
                : { top: 40, right: 40, left: 10, bottom: 50 }
            }
          >
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis {...dataX} domain={[0, Math.ceil(bound)]} />
            <YAxis {...dataY} domain={[0, Math.ceil(bound)]} />

            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend />
            <ReferenceLine
              segment={[
                { x: 0, y: 0 },
                { x: bound, y: bound }
              ]}
              stroke="red"
              strokeDasharray="5 5"
              strokeWidth={isMobile ? 1 : 2}
              opacity={0.7}
            />

            {(dataSeparation || separateByPosition).map((obj: any) => (
              <Scatter key={obj.label} name={obj.label} data={getElementsWithXP().filter(obj.filter)} fill={obj.fill}>
                <LabelList dataKey="web_name" position="left" />
              </Scatter>
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

  );
}

export default AppScatterPlot;

const LoaderContainer = () => {
  const isMobile = useIsMobile();
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className={isMobile ? "text-lg" : "text-xl"}>Loading...</CardTitle>
        <CardDescription className={isMobile ? "text-sm" : "text-base"}>
          Point per game vs Expected points
        </CardDescription>
      </CardHeader>
      <CardContent className={`${isMobile ? 'h-[300px]' : 'h-[400px]'} flex items-center justify-center`}>
        <div className={`animate-spin rounded-full border-b-2 border-gray-900 ${isMobile ? 'h-16 w-16' : 'h-32 w-32'}`}></div>
      </CardContent>
    </Card>
  )
}
