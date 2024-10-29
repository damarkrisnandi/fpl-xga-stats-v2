"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Armchair, RefreshCcw, Sparkle, Sparkles, ArrowDownUp } from "lucide-react";
import {
    getExpectedPoints,
    optimizationProcess,
    positionMapping,
    previousSeason,
    getTeamLogoUrl
  } from "@/utils/index";
import Image from "next/image";

import { useEffect, useState } from "react";
import AppInputMyTeam from "./AppInputMyTeam";
import AppSpinner from "./AppSpinner";
import AppExpectedPts from "./AppExpectedPts";
import AppFailedToFetch from "./AppFailedToFetch";
import AppNextFixtures from "./AppNextFixtures";
import { AppCurrentFixtures } from "./AppNextFixtures";
import {
  getArchivedBootstrap,
  getBootstrapFromStorage,
  getFixtures,
  getManagerData,
  getPicksData,
} from "@/services/index";
import AppElements from "./AppElements";
import { ScrollArea } from "../ui/scroll-area";

export default function AppTransferDialog({ player }: any) {
    const [bootstrap, setBootstrap] = useState<any>(null);
  const [bootstrapHist, setBootstrapHist] = useState<any>(null);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [fixtures, setFixtures] = useState<any>([]);
  const [picks, setPicks] = useState<any>(null);
  const [optimizedPicks, setOptimizedPicks] = useState<any>([]);
  const [manager, setManager] = useState<any>(null);

  const [isOptimize, setIsOptimize] = useState<boolean>(false);
  const [dataView, setDataView] = useState<any>([]);
  const elementMapping = (id: number) =>
    bootstrap.elements.find((el: any) => el.id == id);
  const setDataPicks = () => {
    getManagerData(localStorage.getItem("manager_id_stored") || 0).then(
      (value: any) => {
        setManager(value);
        if (!picks) {
          if (value) {
            getPicksData(value.id, currentEvent.id).then((pickData) => {
              setPicks({
                ...pickData,
                picks: pickData.picks.map((pick: any) => {
                  return {
                    ...pick,
                    surplus_xp_prev: elementMapping(pick.element).event_points -
                      getExpectedPoints(
                        elementMapping(pick.element),
                        currentEvent.id,
                        -1,
                        fixtures,
                        bootstrap?.teams,
                        bootstrapHist?.elements.find((elh: any) =>
                          elh.code == elementMapping(pick.element).code
                        ),
                      ),
                    xp: getExpectedPoints(
                      elementMapping(pick.element),
                      currentEvent.id,
                      0,
                      fixtures,
                      bootstrap?.teams,
                      bootstrapHist?.elements.find((elh: any) =>
                        elh.code == elementMapping(pick.element).code
                      ),
                    ),
                  };
                }),
              });

              setDataView(
                pickData.picks.map((pick: any) => {
                  return {
                    ...pick,
                    xp: getExpectedPoints(
                      elementMapping(pick.element),
                      currentEvent.id,
                      0,
                      fixtures,
                      bootstrap?.teams,
                      bootstrapHist?.elements.find((elh: any) =>
                        elh.code == elementMapping(pick.element).code
                      ),
                    ),
                  };
                }),
              );

              setIsOptimize(false);
            });
          }
        }
      },
    );
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

  const totalSurplusXpPrev = (picksData: any) => {
    if (!picksData) {
      return 0;
    }
    let total = 0;
    for (let pick of picksData.picks) {
      total += pick.surplus_xp_prev;
    }

    return total;
  };

  useEffect(() => {
    if (!bootstrap) {
      getBootstrapFromStorage().then((value: any) => {
        setBootstrap(value);
        setTimeout(() => {
            console.log(bootstrap);
        }, 2000)
        
      });
    }

    if (!bootstrapHist) {
      getArchivedBootstrap(previousSeason).then((value: any) => {
        setBootstrapHist(value);
      });
    }

    if (bootstrap && !bootstrap.error) {
      const currentAndPreviousEvents = bootstrap.events
        .filter(
          (event: any) =>
            new Date(event.deadline_time).getTime() <= new Date().getTime(),
        );

      const allNextEvents = bootstrap.events.filter(
        (event: any) =>
          new Date(event.deadline_time).getTime() > new Date().getTime(),
      )[0];

      setCurrentEvent(
        currentAndPreviousEvents.length > 0
          ? currentAndPreviousEvents.at(-1)
          : 0,
      );

      // setNextEvent(allNextEvents.length > 0 ? allNextEvents[0] : 39);

      if (fixtures.length == 0) {
        getFixtures().then((dataFixtures: any) => {
          setFixtures(dataFixtures);
        });
      }

      if (
        currentEvent &&
        !currentEvent.error &&
        localStorage.getItem("manager_id_stored") &&
        !manager
      ) {
        setDataPicks();
      }
    }
  }, [bootstrap, bootstrapHist, fixtures, manager, picks]);

    // useEffect(() => {
    //     console.log('cekk', elements)
    // }, [elements])
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

  if (picks && picks.error) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <AppFailedToFetch />
      </div>
    );
  }
  const handleFindMyTeam = (event: any) => {
    localStorage.setItem(`manager_id_stored`, event);
    setTimeout(() => {
      setDataPicks();
    }, 300);
  };

  const handleRemoveMyTeam = (event: any) => {
    setManager(null);
    setPicks(null);
    setDataView([]);
  };

  const nextFixtures = (element: any) =>
    fixtures.filter(
      (fix: any) =>
        fix.event == currentEvent.id + 1 &&
        (fix.team_h == element.team || fix.team_a == element.team),
    );

  const currentFixtures = (element: any) =>
    fixtures.filter(
      (fix: any) =>
        fix.event == currentEvent.id &&
        (element.team == fix.team_h || element.team == fix.team_a),
    );
  return (
    <Dialog className="min-w-full" >
      <DialogTrigger asChild>
        <Button className="bg-black text-white text-xs w-6 h-6 p-0" >
            <ArrowDownUp className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[70vw]">
        <DialogHeader>
          <DialogTitle>Make Transfer Hit</DialogTitle>
          <DialogDescription>
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex justify-between bg-slate-200">
            <div className={`w-full h-14 md:w-full md:h-24 py-1 px-3 md:py-3 md:px-5 flex justify-start items-center bg-slate-200 space-x-2`}>
                <div className="relative w-6 h-6 md:w-12 md:h-12">
                    <Image
                    src={getTeamLogoUrl(player.team_code)}
                    fill={true}
                    className="w-6 h-6 md:w-12 md:h-12"
                    sizes="20"
                    alt={`t${player.team_code}`}
                    />
                </div>
                <div>
                    <p className="text-xs md:text-sm font-semibold">
                    {player.web_name}
                    {/* {positionMapping(player.element_type)} */}
                    </p>
                    <p className="text-xs font-light">
                    {positionMapping(
                        player.element_type,
                    )}
                    </p>
                </div>
            </div>
            <div className="flex justify-end">
                <StatItem label="COST" value={(player.now_cost / 10).toFixed(1)}/>
                <AppNextFixtures
                  teams={bootstrap?.teams}
                  element={player}
                  nextFixtures={nextFixtures(player)}
                />

                <AppExpectedPts
                  element={player}
                  elementHist={bootstrapHist?.elements.find((elh: any) =>
                    elh.code == player.code
                  )}
                  currentEvent={currentEvent}
                  deltaEvent={0}
                  fixtures={fixtures}
                  teams={bootstrap?.teams}
                  multiplier={player.multiplier}
                />
            </div>
        </div>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
        {
            bootstrap?.elements
            .filter(({ element_type }: any) => player.element_type == element_type)
            .toSorted(
                (a: any, b: any) =>
                  b.total_points -
                  a.total_points,
              )
            .map((player: any) => (
                <div className="w-full flex justify-between bg-slate-200">
                    <div className={`w-full h-14 md:w-full md:h-24 py-1 px-3 md:py-3 md:px-5 flex justify-start items-center bg-slate-200`}>
                        <Button className="bg-black text-white text-xs w-6 h-6 p-0" >
                            <ArrowDownUp className="w-4 h-4" />
                        </Button>
                        <div className="relative w-6 h-6 md:w-12 md:h-12">
                            <Image
                            src={getTeamLogoUrl(player.team_code)}
                            fill={true}
                            className="w-6 h-6 md:w-12 md:h-12"
                            sizes="20"
                            alt={`t${player.team_code}`}
                            />
                        </div>
                        <div>
                            <p className="text-xs md:text-sm font-semibold">
                            {player.web_name}
                            {/* {positionMapping(player.element_type)} */}
                            </p>
                            <p className="text-xs font-light">
                            {positionMapping(
                                player.element_type,
                            )}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <StatItem label="COST" value={(player.now_cost / 10).toFixed(1)}/>
                        <AppNextFixtures
                        teams={bootstrap?.teams}
                        element={player}
                        nextFixtures={nextFixtures(player)}
                        />

                        <AppExpectedPts
                        element={player}
                        elementHist={bootstrapHist?.elements.find((elh: any) =>
                            elh.code == player.code
                        )}
                        currentEvent={currentEvent}
                        deltaEvent={0}
                        fixtures={fixtures}
                        teams={bootstrap?.teams}
                        multiplier={player.multiplier}
                        />
                    </div>
                </div>
            ))
        }
        </ScrollArea>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

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
