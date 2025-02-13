"use client";
import { useState } from "react";
import AppSpinner from "./AppSpinner";
import AppExpectedPts from "./AppExpectedPts";
import AppFailedToFetch from "./AppFailedToFetch";
import AppNextFixtures from "./AppNextFixtures";
import {
  optimizationProcess,
  positionMapping,
  previousSeason,
  getTeamLogoUrl
} from "@/utils/index";
// import { Button } from "../ui/button";
import { Armchair, RefreshCcw, Sparkle, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
// import { Separator } from "@radix-ui/react-select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  QueryClient,
  QueryClientProvider,
  useQueries,
  useQuery,
} from "@tanstack/react-query";
import Image from 'next/image'
import useBootstrap from "@/hooks/use-bootstrap";
import useBootstrapHist from "@/hooks/use-bootstraphist";
import useFixtures from "@/hooks/use-fixtures";
import useCurrentEvent from "@/hooks/use-currentevent";

const AppWildCardNextFixtures = () => {
  const { bootstrap, isLoadingBootstrap, errorBootstrap } = useBootstrap();
  const { bootstrapHist, isLoadingBootstrapHist, errorBootstrapHist } = useBootstrapHist({ season: previousSeason })
  const { fixtures, isLoadingFixtures, errorFixtures } = useFixtures();
  const { currentEvent } = useCurrentEvent({ bootstrap }) 

  const [isOptimize, setIsOptimize] = useState<boolean>(false);
  const elementMapping = (id: number) =>
    bootstrap.elements.find((el: any) => el.id == id);

  const {
    data: dataView,
    error: errorDataView,
  } = useQuery({
    queryKey: ["dataView"],
    queryFn: () => {
      const wildCardDraft = optimizationProcess(
        bootstrap?.elements,
        bootstrapHist?.elements,
        fixtures,
        bootstrap?.teams,
        currentEvent,
        0,
      );
      const wildcardPicks = optimizationProcess(
        bootstrap?.elements,
        bootstrapHist?.elements,
        fixtures,
        bootstrap?.teams,
        currentEvent,
        0,
        { picks: wildCardDraft },
      );
      return wildcardPicks;
    },
    enabled: !!bootstrap && !!bootstrapHist && !!fixtures && !!currentEvent,
  });
  const totalXp = (picksData: any) => {
    if (!picksData || picksData.length == 0) {
      return 0;
    }
    let total = 0;
    for (let pick of picksData) {
      total += pick.xp * pick.multiplier;
    }

    return total;
  };

  const totalCost = (picksData: any) => {
    if (!picksData || picksData.length == 0) {
      return 0;
    }
    let total = 0;
    for (let pick of picksData) {
      total += elementMapping(pick.element).now_cost;
    }

    return total / 10;
  };

  if (
    isLoadingBootstrap ||
    isLoadingBootstrapHist ||
    isLoadingFixtures ||
    !dataView
  ) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <AppSpinner />
      </div>
    );
  }

  if (!currentEvent) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <AppSpinner />
      </div>
    );
  }

  if (errorBootstrap || errorBootstrapHist || errorFixtures || errorDataView) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <AppFailedToFetch />
      </div>
    );
  }

  const nextFixtures = (element: any) =>
    fixtures.filter(
      (fix: any) =>
        fix.event == currentEvent.id + 1 &&
        (fix.team_h == element.team || fix.team_a == element.team),
    );
  const getFormation = () => {
    const defNum = dataView.filter(
      (dv: any, i: number) =>
        i < 12 && elementMapping(dv.element).element_type == 2,
    ).length;
    const midNum = dataView.filter(
      (dv: any, i: number) =>
        i < 12 && elementMapping(dv.element).element_type == 3,
    ).length;
    const fwdNum = dataView.filter(
      (dv: any, i: number) =>
        i < 12 && elementMapping(dv.element).element_type == 4,
    ).length;

    return `${defNum}-${midNum}-${fwdNum}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Wildcard Draft</CardTitle>
        <CardDescription>
          Wildcard Draft for Gameweek {currentEvent.id + 1}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2"></CardContent>
      <div className="w-full">
        <div className="w-full flex justify-end my-3">
          <StatItem label={"Formation"} value={getFormation()} />
          <StatItem
            label={"COST"}
            value={dataView.length > 0 ? totalCost(dataView).toFixed(1) : 0}
          />
          <StatItem
            label={isOptimize
              ? `ΣxP${currentEvent.id + 1}*`
              : `ΣxP${currentEvent.id + 1}`}
            value={dataView.length > 0 ? totalXp(dataView).toFixed(2) : 0}
          />
        </div>
        {dataView.length > 0 &&
          dataView.map((player: any, index: number) => (
            <div className="w-full" key={index}>
              {player.position == 12 && (
                <div className="w-full flex justify-center items-center my-2">
                  <Badge className="flex justify-center items-center text-xs w-3/12 font-semibold bg-slate-800">
                    <Armchair className="w-3 h-3 md:m-2" /> Bench
                  </Badge>
                </div>
              )}
              <div className="w-full flex justify-between bg-slate-200">
                <div
                  className={`w-full h-14 md:w-72 md:h-24 py-1 px-3 md:py-3 md:px-5 flex justify-start items-center bg-slate-200 space-x-2`}
                >
                  <div className="relative w-6 h-6 md:w-12 md:h-12">
                  <Image
                    src={getTeamLogoUrl(elementMapping(player.element).team_code)}
                    fill={true}
                    className="w-6 h-6 md:w-12 md:h-12"
                    sizes="20"
                    alt={`t${elementMapping(player.element).team_code}`}
                  />
                </div>
                  {/* {index >= 11 ? <Armchair className="w-3 h-3 md:m-2" /> : null} */}
                  <div>
                    <p className="text-xs md:text-sm font-semibold">
                      {elementMapping(player.element).web_name}
                      {/* {positionMapping(elementMapping(player.element).element_type)} */}
                    </p>
                    <p className="text-xs font-light">
                      {positionMapping(
                        elementMapping(player.element).element_type,
                      )}
                    </p>
                  </div>
                  {player.is_captain
                  ? (
                    player.multiplier == 2
                      ? (
                        <div className="h-4 w-4 md:h-6 md:w-6 shadow-lg rounded-full bg-slate-800 text-white flex justify-center items-center font-semibold text-xs md:text-sm">
                          C
                        </div>
                      )
                      : (
                        <div className="h-4 w-4 md:h-6 md:w-6 shadow-lg rounded-full bg-white flex justify-center items-center font-semibold text-xs md:text-sm">
                          C
                        </div>
                      )
                  )
                  : null}
                {player.is_vice_captain && (
                  <div className="h-4 w-4 md:h-6 md:w-6 shadow-lg rounded-full bg-slate-800 text-white flex justify-center items-center font-semibold text-xs md:text-sm">
                    V
                  </div>
                )}
                </div>
                <div className="flex justify-end">
                  <StatItem
                    label={`COST`}
                    value={(elementMapping(player.element).now_cost / 10)
                      .toFixed(
                        1,
                      ) + "M"}
                  />

                  <AppNextFixtures
                    teams={bootstrap?.teams}
                    element={elementMapping(player.element)}
                    nextFixtures={nextFixtures(elementMapping(player.element))}
                  />

                  <AppExpectedPts
                    element={elementMapping(player.element)}
                    elementHist={bootstrapHist?.elements.find(
                      (elh: any) =>
                        elh.code == elementMapping(player.element).code,
                    )}
                    currentEvent={currentEvent}
                    deltaEvent={0}
                    fixtures={fixtures}
                    teams={bootstrap?.teams}
                    multiplier={player.multiplier}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </Card>
  );
};

export default AppWildCardNextFixtures;

const StatItem = (props: any) => {
  const { className, label, value } = props;
  return (
    <div
      className={`w-14 h-14 md:w-24 md:h-24 p-1 md:p-3 flex flex-col justify-center items-center ${
        className || ""
      } bg-slate-200`}
    >
      <p className="text-[0.6em] md:text-sm">{label}</p>
      <p className="text-sm md:text-xl font-semibold">{value}</p>
    </div>
  );
};
