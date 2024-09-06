"use client";
import { useState, useEffect } from "react";
import AppInputMyTeam from "./AppInputMyTeam";
import AppSpinner from "./AppSpinner";
import AppExpectedPts from "./AppExpectedPts";
import AppFailedToFetch from "./AppFailedToFetch";
import AppNextFixtures from "./AppNextFixtures";
import {
    getArchivedBootstrap,
  getBootstrapFromStorage,
  getFixtures,
  getManagerData,
  getPicksData,
} from "@/services/index";

import {
  positionMapping,
  getExpectedPoints,
  optimizationProcess,
  previousSeason,
} from "@/utils/index";
import { Button } from "../ui/button";
import { Armchair, RefreshCcw, Sparkle, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "@radix-ui/react-select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const AppWildCardNextFixtures = () => {
  const [bootstrap, setBootstrap] = useState<any>(null);
  const [bootstrapHist, setBootstrapHist] = useState<any>(null);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [fixtures, setFixtures] = useState<any>([]);
  const [isOptimize, setIsOptimize] = useState<boolean>(false);
  const [dataView, setDataView] = useState<any>([]);
  const elementMapping = (id: number) =>
    bootstrap.elements.find((el: any) => el.id == id);
  const setDataPicks = () => {
    const wildCardDraft = optimizationProcess(
      bootstrap.elements,
      bootstrapHist.elements,
      fixtures,
      bootstrap?.teams,
      currentEvent,
      0
    );
    const wildcardPicks = optimizationProcess(
      bootstrap.elements,
      bootstrapHist.elements,
      fixtures,
      bootstrap?.teams,
      currentEvent,
      0,
      { picks: wildCardDraft }
    );
    setDataView(wildcardPicks);
  };
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

  useEffect(() => {
    if (!bootstrap) {
      getBootstrapFromStorage().then((value: any) => {
        setBootstrap(value);
      });
    }

    if (!bootstrapHist) {
        getArchivedBootstrap(previousSeason).then((value: any) => {
            setBootstrapHist(value);
        })
    }

    if (bootstrap && !bootstrap.error) {
      const currentAndPreviousEvents = bootstrap.events
        .filter(
          (event: any) =>
            new Date(event.deadline_time).getTime() <= new Date().getTime()
      );

      const allNextEvents = bootstrap.events.filter(
        (event: any) =>
          new Date(event.deadline_time).getTime() > new Date().getTime()
      )[0]; 

    setCurrentEvent(currentAndPreviousEvents.length > 0 ? currentAndPreviousEvents.at(-1) : 0);

    // setNextEvent(allNextEvents.length > 0 ? allNextEvents[0] : 39);

      if (fixtures.length == 0) {
        getFixtures().then((dataFixtures: any) => {
          setFixtures(dataFixtures);
        });
      }

      if (currentEvent && !currentEvent.error && bootstrapHist && !bootstrapHist.error) {
        setDataPicks();
      }
    }
  }, [bootstrap, bootstrapHist, fixtures]);
  if (!bootstrap) {
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

  if (bootstrap && bootstrap.error) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <AppFailedToFetch />
      </div>
    );
  }

  if (!bootstrapHist) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <AppSpinner />
      </div>
    );
  }


  if (bootstrapHist && bootstrapHist.error) {
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
        (fix.team_h == element.team || fix.team_a == element.team)
    );
    const getFormation = () => {
        const defNum = dataView.filter((dv: any, i: number) => i < 12 && elementMapping(dv.element).element_type == 2).length;
        const midNum = dataView.filter((dv: any, i: number) => i < 12 && elementMapping(dv.element).element_type == 3).length;
        const fwdNum = dataView.filter((dv: any, i: number) => i < 12 && elementMapping(dv.element).element_type == 4).length;

        return `${defNum}-${midNum}-${fwdNum}`;
    }

  return (
    <Card className="w-11/12 md:w-5/12">
      <CardHeader>
        <CardTitle>Wildcard Draft</CardTitle>
        <CardDescription>
          Wildcard Draft for Gameweek {currentEvent.id + 1}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2"></CardContent>
      <div className="w-full">
        <div className="w-full flex justify-end my-3">
            <StatItem
            label={"Formation"}
            value={getFormation()}
          />
          <StatItem
            label={"COST"}
            value={dataView.length > 0 ? totalCost(dataView).toFixed(1) : 0}
          />
          <StatItem
            label={
              isOptimize
                ? `ΣxP${currentEvent.id + 1}*`
                : `ΣxP${currentEvent.id + 1}`
            }
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
                  className={`w-44 h-14 md:w-72 md:h-24 py-1 px-3 md:py-3 md:px-5 flex justify-start items-center bg-slate-200 space-x-2`}
                >
                  {index >= 11 ? <Armchair className="w-3 h-3 md:m-2" /> : null}
                  <div>
                    <p className="text-xs md:text-sm font-semibold">
                      {elementMapping(player.element).web_name}
                      {/* {positionMapping(elementMapping(player.element).element_type)} */}
                    </p>
                    <p className="text-xs font-light">
                      {positionMapping(
                        elementMapping(player.element).element_type
                      )}
                    </p>
                  </div>
                  {player.is_captain ? (
                    player.multiplier == 2 ? (
                      <div className="h-6 w-6 shadow-lg rounded-full bg-slate-800 text-white flex justify-center items-center font-semibold text-xs md:text-sm">
                        C
                      </div>
                    ) : (
                      <div className="h-6 w-6 shadow-lg rounded-full bg-white flex justify-center items-center font-semibold text-xs md:text-sm">
                        C
                      </div>
                    )
                  ) : null}
                  {player.is_vice_captain && (
                    <div className="h-6 w-6 shadow-lg rounded-full bg-slate-800 text-white flex justify-center items-center font-semibold text-xs md:text-sm">
                      V
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <StatItem
                    label={`COST`}
                    value={
                      (elementMapping(player.element).now_cost / 10).toFixed(
                        1
                      ) + "M"
                    }
                  />

                  <AppNextFixtures
                    teams={bootstrap?.teams}
                    element={elementMapping(player.element)}
                    nextFixtures={nextFixtures(elementMapping(player.element))}
                  />

                  <AppExpectedPts
                    element={elementMapping(player.element)}
                    elementHist={bootstrapHist?.elements.find((elh: any) => elh.code == elementMapping(player.element).code)}
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
