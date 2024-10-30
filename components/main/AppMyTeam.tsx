"use client";
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

import {
  getExpectedPoints,
  optimizationProcess,
  positionMapping,
  previousSeason,
  getTeamLogoUrl
} from "@/utils/index";
import { Button } from "../ui/button";
import { Armchair, RefreshCcw, Sparkle, Sparkles, ArrowDownUp, ArrowRightLeft } from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "@radix-ui/react-select";
import AppTransferDialog from "./AppTransferDialog";
import Image from "next/image";

const AppMyTeam = () => {
  const [bootstrap, setBootstrap] = useState<any>(null);
  const [bootstrapHist, setBootstrapHist] = useState<any>(null);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [fixtures, setFixtures] = useState<any>([]);
  const [picks, setPicks] = useState<any>(null);
  const [optimizedPicks, setOptimizedPicks] = useState<any>([]);
  const [manager, setManager] = useState<any>(null);

  const [isOptimize, setIsOptimize] = useState<boolean>(false);
  const [dataView, setDataView] = useState<any>([]);
  const [transferPlan, setTransferPlan] = useState<any[]>([]);
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

  const onHitTransfer = ({element_out, element, transfer}: any) => {
    setTransferPlan([...transferPlan, {element_out, element, transfer}])
    // setDataPicks()
    setPicks({...picks, picks: picks.picks.map((dv: any) => {
      if (dv.element === element_out) {
        return {...dv, element_out, element, transfer}
      }
      return dv;
    })})
    setDataView(dataView.map((dv: any) => {
      if (dv.element === element_out) {
        return {...dv, element_out, element, transfer}
      }
      return dv;
    }))
    
  } 

  return (
    <div className="w-11/12 md:w-5/12">
      <AppInputMyTeam
        onFindMyTeam={handleFindMyTeam}
        onRemoveMyTeam={handleRemoveMyTeam}
      />
      {manager && (
        <div className="flex space-x-1 w-full mt-1">
          <Button
            className="text-xs flex space-x-5"
            variant={"outline"}
            disabled={isOptimize}
            onClick={(event: any) => {
              setDataView(
                optimizationProcess(
                  bootstrap.elements,
                  bootstrapHist.elements,
                  fixtures,
                  bootstrap.teams,
                  currentEvent,
                  0,
                  picks,
                ).map((dv: any) => {
                  const transfer = transferPlan.find((tp: any) => tp.element == dv.element);
                  return {...dv, ...transfer}
                })
              );
              setIsOptimize(true);
            }}
          >
            <Sparkles className="w-4 h-4" />
            &nbsp;Optimize
          </Button>
          <Button
            className="text-xs"
            variant={"outline"}
            disabled={!isOptimize}
            onClick={(event: any) => {
              setDataView(picks.picks);
              setIsOptimize(false);
            }}
          >
            <RefreshCcw className="w-4 h-4" />
          </Button>
        </div>
      )}
      {manager && (
        <div className="w-full flex justify-end my-3">
          <StatItem
            label={`P${currentEvent.id} - xP${currentEvent.id}`}
            value={totalSurplusXpPrev(picks).toFixed(2)}
            className={`
            ${
              totalSurplusXpPrev(picks) > 0 ? "bg-green-200 text-green-700" : ""
            }
            ${totalSurplusXpPrev(picks) < 0 ? "bg-red-200 text-red-700" : ""}
          `}
          />
          <StatItem
            label={isOptimize
              ? `ΣxP${currentEvent.id + 1}*`
              : `ΣxP${currentEvent.id + 1}`}
            value={dataView.length > 0 ? totalXp(dataView).toFixed(2) : 0}
          />
        </div>
      )}
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
                className={`w-full h-14 md:w-full md:h-24 py-1 px-3 md:py-3 md:px-5 flex justify-start items-center bg-slate-200 space-x-2`}
              >
                <div>
                    <AppTransferDialog player={elementMapping(player.element)} currentFixtures={currentFixtures(player)} picks={dataView} onHitTransfer={onHitTransfer}/>
                </div>
                {/* <div className="relative w-6 h-6 md:w-12 md:h-12">
                  <Image
                    src={getTeamLogoUrl(elementMapping(player.element).team_code)}
                    fill={true}
                    className="w-6 h-6 md:w-12 md:h-12"
                    sizes="20"
                    alt={`t${elementMapping(player.element).team_code}`}
                  />
                </div> */}
                {/* {index >= 11 ? <Armchair className="w-3 h-3 md:m-2" /> : null} */}
                <div>
                  <div>
                    <p className="text-xs md:text-sm font-semibold">
                      {elementMapping(player.element).web_name}
                    </p>
                    {
                      player.transfer &&
                      <div className="flex items-center space-x-1 text-xs md:text-sm">
                        <ArrowRightLeft  className="w-3 h-3" />
                        <p>{ elementMapping(player.element_out).web_name }</p>
                      </div>
                    }
                  </div>
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
                {currentFixtures(elementMapping(player.element))[0].started
                  ? (
                    <StatItem
                      label={`GW${currentEvent.id}`}
                      value={elementMapping(player.element).event_points}
                    />
                  )
                  : (
                    <AppExpectedPts
                      element={elementMapping(player.element)}
                      elementHist={bootstrapHist?.elements.find((elh: any) =>
                        elh.code == elementMapping(player.element).code
                      )}
                      currentEvent={currentEvent}
                      deltaEvent={-1}
                      fixtures={fixtures}
                      teams={bootstrap?.teams}
                      multiplier={player.multiplier}
                    />
                  )}
                {currentFixtures(elementMapping(player.element))[0].started
                  ? (
                    <StatItem
                      label={`P${currentEvent.id}-xP${currentEvent.id}`}
                      value={(
                        elementMapping(player.element).event_points -
                        getExpectedPoints(
                          elementMapping(player.element),
                          currentEvent.id,
                          -1,
                          fixtures,
                          bootstrap?.teams,
                          bootstrapHist?.elements.find((elh: any) =>
                            elh.code == elementMapping(player.element).code
                          ),
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
                                bootstrap?.teams,
                                bootstrapHist?.elements.find((elh: any) =>
                                  elh.code ==
                                    elementMapping(player.element).code
                                ),
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
                                  bootstrap?.teams,
                                  bootstrapHist?.elements.find((elh: any) =>
                                    elh.code ==
                                      elementMapping(player.element).code
                                  ),
                                ) <
                            0
                          ? "bg-red-200 text-red-700"
                          : ""
                      }
                  `}
                    />
                  )
                  : (
                    <AppCurrentFixtures
                      teams={bootstrap?.teams}
                      element={elementMapping(player.element)}
                      currentFixtures={currentFixtures(
                        elementMapping(player.element),
                      )}
                    />
                  )}
                <AppNextFixtures
                  teams={bootstrap?.teams}
                  element={elementMapping(player.element)}
                  nextFixtures={nextFixtures(elementMapping(player.element))}
                />

                <AppExpectedPts
                  element={elementMapping(player.element)}
                  elementHist={bootstrapHist?.elements.find((elh: any) =>
                    elh.code == elementMapping(player.element).code
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
