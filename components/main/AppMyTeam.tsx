"use client";
import { useState, useEffect } from "react";
import AppInputMyTeam from "./AppInputMyTeam";
import AppSpinner from "./AppSpinner";
import AppExpectedPts from "./AppExpectedPts";
import AppFailedToFetch from "./AppFailedToFetch";
import AppNextFixtures from "./AppNextFixtures";
import {
  getBootstrapFromStorage,
  getFixtures,
  getManagerData,
  getPicksData,
} from "@/services/index";

import {
  positionMapping,
  getExpectedPoints,
  optimizationProcess,
} from "@/utils/index";
import { Button } from "../ui/button";
import { Armchair, RefreshCcw, Sparkle, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "@radix-ui/react-select";

const AppMyTeam = () => {
  const [bootstrap, setBootstrap] = useState<any>(null);
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
                    surplus_xp_prev: elementMapping(pick.element).event_points - getExpectedPoints(
                      elementMapping(pick.element),
                      currentEvent.id,
                      -1,
                      fixtures,
                      bootstrap?.teams
                    ),
                    xp: getExpectedPoints(
                      elementMapping(pick.element),
                      currentEvent.id,
                      0,
                      fixtures,
                      bootstrap?.teams
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
                      bootstrap?.teams
                    ),
                  };
                })
              );

              setIsOptimize(false)
            });
          }
        }
      }
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

  const totalSurplusXpPrev = (picksData:any ) => {
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
      });
    }

    if (bootstrap && !bootstrap.error) {
      setCurrentEvent(
        bootstrap.events
          .filter(
            (event: any) =>
              new Date(event.deadline_time).getTime() <= new Date().getTime()
          )
          .at(-1)
      );

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
  }, [bootstrap, fixtures, manager, picks]);
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
        (fix.team_h == element.team || fix.team_a == element.team)
    );

  return (
    <div className="w-11/12 md:w-5/12">
      <AppInputMyTeam
        onFindMyTeam={handleFindMyTeam}
        onRemoveMyTeam={handleRemoveMyTeam}
      />
      { manager && 
      <div className="flex space-x-1 w-full mt-1">
        <Button
          className="text-xs flex space-x-5"
          variant={"outline"}
          disabled={isOptimize}
          onClick={(event: any) => {
            
            setDataView(
              optimizationProcess(
                bootstrap.elements,
                fixtures,
                bootstrap.teams,
                currentEvent,
                0,
                manager,
                picks
              )
            );
            setIsOptimize(true)
          }}
        >
          <Sparkles className="w-4 h-4" />&nbsp;Optimize
        </Button>
        <Button
          className="text-xs"
          variant={"outline"}
          disabled={!isOptimize}
          onClick={(event: any) => {
            setDataView(picks.picks);
            setIsOptimize(false)
          }}
        >
          <RefreshCcw />
        </Button>
      </div>
      }
      { manager && 
      <div className="w-full flex justify-end my-3">
        <StatItem
          label={`P${currentEvent.id} - xP${currentEvent.id}`}
          value={totalSurplusXpPrev(picks).toFixed(2)}
          className={`
            ${ totalSurplusXpPrev(picks) > 0 ? "bg-green-200 text-green-700" : "" }
            ${ totalSurplusXpPrev(picks) < 0 ? "bg-red-200 text-red-700" : "" }
          `}
        />
        <StatItem
          label={isOptimize ? `ΣxP${currentEvent.id + 1}*` : `ΣxP${currentEvent.id + 1}`}
          value={dataView.length > 0 ? totalXp(dataView).toFixed(2) : 0}
        />
      </div>
      }
      {dataView.length > 0 &&
        dataView.map((player: any, index: number) => (
          <div className="w-full" key={index}>
            {index == 11 && <div className="w-full flex justify-center items-center my-2"><Badge className="flex justify-center items-center text-xs w-3/12 font-semibold bg-slate-800"><Armchair className="w-3 h-3 md:m-2"/> Bench</Badge></div>}
          <div className="w-full flex justify-between bg-slate-200">
            

            <div
              className={`w-28 h-14 md:w-48 md:h-24 py-1 px-3 md:py-3 md:px-5 flex justify-start items-center bg-slate-200 space-x-2`}
            >
              { index >= 11 ? <Armchair className="w-3 h-3 md:m-2"/> :  null}
              <div> 
                <p className="text-xs md:text-sm font-semibold">
                  {elementMapping(player.element).web_name}
                  {/* {positionMapping(elementMapping(player.element).element_type)} */}
                </p>
                <p className="text-xs font-light">
                  {positionMapping(elementMapping(player.element).element_type)}
                </p>
              </div>
              {player.is_captain ? <div className="h-8 w-8 shadow-lg rounded-full bg-slate-800 text-white flex justify-center items-center font-semibold text-xs md:text-sm">C</div>: null }
            </div>
            <div className="flex justify-end">
              <StatItem
                label={`GW${currentEvent.id}`}
                value={elementMapping(player.element).event_points}
              />
              <StatItem
                label={`P${currentEvent.id}-xP${currentEvent.id}`}
                value={(
                  elementMapping(player.element).event_points -
                  getExpectedPoints(
                    elementMapping(player.element),
                    currentEvent.id,
                    -1,
                    fixtures,
                    bootstrap?.teams
                  )
                ).toFixed(2)}
                className={`
            ${
              elementMapping(player.element).event_points -
                getExpectedPoints(
                  elementMapping(player.element),
                  currentEvent.id,
                  -1,
                  fixtures,
                  bootstrap?.teams
                ) >
              0
                ? "bg-green-200 text-green-700"
                : ""
            }
            ${
              elementMapping(player.element).event_points == 0 ||
              elementMapping(player.element).event_points -
                getExpectedPoints(
                  elementMapping(player.element),
                  currentEvent.id,
                  -1,
                  fixtures,
                  bootstrap?.teams
                ) <
                0
                ? "bg-red-200 text-red-700"
                : ""
            }
            `}
              />
              <AppNextFixtures
                teams={bootstrap?.teams}
                element={elementMapping(player.element)}
                nextFixtures={nextFixtures(elementMapping(player.element))}
              />

              <AppExpectedPts
                element={elementMapping(player.element)}
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
  );
};

export default AppMyTeam;

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
