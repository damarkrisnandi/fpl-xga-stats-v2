"use client";
import { useCallback, useEffect, useState } from "react";
import AppExpectedPts from "./AppExpectedPts";
import AppFailedToFetch from "./AppFailedToFetch";
import AppInputMyTeam from "./AppInputMyTeam";
import AppNextFixtures, { AppCurrentFixtures } from "./AppNextFixtures";
import AppSpinner from "./AppSpinner";

import {
  getExpectedPoints,
  getTeamLogoUrl,
  optimizationProcess,
  positionMapping,
  previousSeason
} from "@/utils/index";
import { Armchair, ArrowRightLeft, RefreshCcw, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
// import { Separator } from "@radix-ui/react-select";
import Image from "next/image";
// import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import useBootstrap from "@/hooks/use-bootstrap";
import useBootstrapHist from "@/hooks/use-bootstraphist";
import useCurrentEvent from "@/hooks/use-currentevent";
import useFixtures from "@/hooks/use-fixtures";
import useLastFiveGw from "@/hooks/use-lastfivegw";
import withQueryClientProvider from "../react-query/MainProvider";

import useMgrAndPicks from "@/hooks/use-mgr-picks";
import { sectionClassName } from "@/utils";
import { PlayerPicked } from "../../models/picks";

const AppMyTeamWithProvider = () => {
  return (<AppMyTeamContent />);
};

const AppMyTeam = withQueryClientProvider(AppMyTeamWithProvider);

const AppMyTeamContent = () => {
  const { bootstrap, isLoadingBootstrap, errorBootstrap } = useBootstrap();
  const { bootstrapHist, isLoadingBootstrapHist, errorBootstrapHist } = useBootstrapHist({ season: previousSeason })
  const { fixtures, isLoadingFixtures, errorFixtures } = useFixtures();
  const { currentEvent, isLoadingCurrentEvent, errorCurrentEvent } = useCurrentEvent({ bootstrap })

  const { last5, isLoadingLast5, errorLast5 } = useLastFiveGw({ bootstrap, event: currentEvent, n: 5 });
  const {
    manager,
    isLoadingManager,
    errorManager,
    picks,
    isLoadingPicks,
    errorPicks,
    refetchManager: _refetchManager,
    refetchPicks: _refetchPicks
  } = useMgrAndPicks(currentEvent);
  // const [bootstrap, setBootstrap] = useState<any>(null);
  // const [bootstrapHist, setBootstrapHist] = useState<any>(null);
  // const [currentEvent, setCurrentEvent] = useState<any>(null);
  // const [fixtures, setFixtures] = useState<any>([]);
  // const [picks, setPicks] = useState<any>(null);
  // const [optimizedPicks, setOptimizedPicks] = useState<any>([]);
  // const [manager, setManager] = useState<any>(null);

  const [isOptimize, setIsOptimize] = useState<boolean>(false);
  const [dataView, setDataView] = useState<any>([]);
  const [transferPlan, setTransferPlan] = useState<any[]>([]);
  const [totalXp, setTotalXp] = useState<number>(0);
  const [totalSurplusXpPrev, setTotalSurplusXpPrev] = useState<number>(0);

  const [chip, _setChip] = useState<string>('');

  // Memoize the elementMapping function to avoid recreating it on every render
  const elementMapping = useCallback((id: number) => {
    if (!bootstrap?.elements) return null;
    return bootstrap.elements.find((el: any) => el.id == id);
  }, [bootstrap?.elements]);

  // Memoize the getXPByElement function to avoid recreating it on every render
  const getXPByElement = useCallback((element: any, delta: number) => {
    if (!currentEvent || !fixtures || !bootstrap?.teams || !bootstrap?.elements) {
      return 0;
    }

    const mappedElement = elementMapping(element);
    if (!mappedElement) return 0;

    const elementHist = bootstrapHist?.elements?.find((elh: any) =>
      elh.code == mappedElement.code
    );

    return getExpectedPoints(
      mappedElement,
      currentEvent?.id || 0,
      delta,
      fixtures,
      bootstrap.teams,
      elementHist,
      last5 as any
    );
  }, [bootstrap, bootstrapHist, currentEvent, elementMapping, fixtures, last5]);
  // Data fetching is now handled by React Query in useMgrAndPicks hook
  const _setDataPicks = () => {
    // This function is no longer needed as data fetching is automated

    //           if (pickData.active_chip == 'freehit') {
    //             getPicksData(value.id, currentEvent.id - 1).then((pickDataPrev) => {
    //               const picks = pickDataPrev.picks.map((pick: any) => {
    //                 return {
    //                   ...pick,
    //                   surplus_xp_prev: (elementMapping(pick.element)?.event_points || 0) - getXPByElement(pick.element, 0),
    //                   xp: getXPByElement(pick.element, 1),
    //                 };
    //               })
    //               setDataView(picks);
    //               setPicks({
    //                 ...pickDataPrev,
    //                 picks,
    //               });
    //               setIsOptimize(false);
    //             })
    //           } else {
    //             const picks = pickData.picks.map((pick: any) => {
    //               return {
    //                 ...pick,
    //                 surplus_xp_prev: (elementMapping(pick.element)?.event_points || 0) - getXPByElement(pick.element, 0),
    //                 xp: getXPByElement(pick.element, 1),
    //               };
    //             })

    //             setPicks({
    //               ...pickData,
    //               picks,
    //             });
    //             setIsOptimize(false);

    //           }

    //         });


    //       }
    //     }
    //   },
    // );
  };

  const calculateTotalXp = useCallback((picksData: any) => {
    if (!picksData || picksData.length === 0) {
      return 0;
    }
    let total = 0;
    for (let pick of picksData) {
      if (pick.xp && pick.multiplier) {
        total += pick.xp * pick.multiplier;
      }
    }

    return total;
  }, []);

  const calculateTotalSurplusXpPrev = useCallback((picksData: any) => {
    if (!picksData) {
      return 0;
    }
    let total = 0;
    for (let pick of picksData) {
      if (pick.surplus_xp_prev) {
        total += pick.surplus_xp_prev;
      }
    }

    return total;
  }, []);

  // Manager and picks data are now automatically fetched by React Query in useMgrAndPicks hook

  useEffect(() => {
    if (!picks || !bootstrap || !bootstrapHist || !currentEvent || !fixtures || !last5) {
      return;
    }

    // Only update dataView if we have actual picks data and necessary functions
    if (picks.picks && elementMapping && getXPByElement) {
      const updatedPicksData = picks.picks.map((pick: any) => {
        return {
          ...pick,
          surplus_xp_prev: (elementMapping(pick.element)?.event_points || 0) - getXPByElement(pick.element, 0),
          xp: getXPByElement(pick.element, 1),
        };
      });
      setDataView(updatedPicksData);
      setIsOptimize(false);
    }
  }, [picks, bootstrap, bootstrapHist, currentEvent, fixtures, last5, elementMapping, getXPByElement]);

  useEffect(() => {
    if (dataView.length > 0) {
      setTotalXp(calculateTotalXp(dataView));
      setTotalSurplusXpPrev(calculateTotalSurplusXpPrev(dataView));
    }
  }, [dataView, calculateTotalXp, calculateTotalSurplusXpPrev]);

  if (isLoadingBootstrap || isLoadingBootstrapHist || isLoadingCurrentEvent || isLoadingFixtures || isLoadingLast5 || isLoadingManager || isLoadingPicks) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <AppSpinner />
      </div>
    );
  }


  if (errorBootstrap || errorBootstrapHist || errorCurrentEvent || errorFixtures || errorLast5 || errorManager || errorPicks) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <AppFailedToFetch />
      </div>
    );
  }


  const handleFindMyTeam = (event: any) => {
    localStorage.setItem(`manager_id_stored`, event);
    // React Query will automatically refetch when managerId changes
    window.location.reload(); // Simple refresh to trigger the hook with new managerId
  };

  const handleRemoveMyTeam = (_event: any) => {
    localStorage.removeItem('manager_id_stored');
    setDataView([]);
    window.location.reload(); // Refresh to clear the data
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

  const _onHitTransfer = ({ element_out, element, transfer, bank }: any) => {
    setTransferPlan([...transferPlan, { element_out, element, transfer, bank }])
    // setDataPicks()
    // setPicks({...picks, picks: picks.picks.map((dv: any) => {
    //   if (dv.element === element_out) {
    //     return {...dv, element_out, element, transfer, bank}
    //   }
    //   return dv;
    // })})
    setDataView(dataView.map((dv: any) => {
      if (dv.element === element_out) {
        return { ...dv, element_out, element, transfer, bank }
      }
      return dv;
    }))

  }

  const _onClearTransfer = (player: any) => {
    setTransferPlan(transferPlan.filter((tp: any) => tp.element !== player.element))
    // setDataPicks()
    // setPicks({...picks, picks: picks.picks.map((dv: any) => {
    //   if (dv.element === player.element) {
    //     return {...dv, element: player.element_out, element_out: undefined, transfer: false}
    //   }
    //   return dv;
    // })})
    setDataView(dataView.map((dv: any) => {
      if (dv.element === player.element) {
        return { ...dv, element: player.element_out, element_out: undefined, transfer: false }
      }
      return dv;
    }))

  }

  const _setValueTempBank = () => {
    let manBank = picks?.entry_history?.bank || 0;
    for (let tp of transferPlan) {
      manBank += tp.bank;
    }

    return manBank
  }


  const played = dataView?.filter((pick: PlayerPicked) => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].includes(pick.position)) ?? [];
  const benched = dataView?.filter((pick: PlayerPicked) => [12, 13, 14, 15].includes(pick.position)) ?? [];

  const gkp_played = played.filter((pick: PlayerPicked) => pick.element_type === 1)
  const def_played = played.filter((pick: PlayerPicked) => pick.element_type === 2)
  const mid_played = played.filter((pick: PlayerPicked) => pick.element_type === 3)
  const fwd_played = played.filter((pick: PlayerPicked) => pick.element_type === 4)

  const played_per_position = [
    { position: 1, players: gkp_played },
    { position: 2, players: def_played },
    { position: 3, players: mid_played },
    { position: 4, players: fwd_played },
  ];

  return (
    <div className={sectionClassName}>
      {/* team input */}
      <AppInputMyTeam
        onFindMyTeam={handleFindMyTeam}
        onRemoveMyTeam={handleRemoveMyTeam}
      />

      {/* optimization action */}
      {manager && (
        <div>
          <div className="flex space-x-1 w-full mt-1">
            <Button
              className="text-xs flex space-x-5"
              variant={"outline"}
              disabled={isOptimize}
              onClick={(_event: any) => {
                setDataView(
                  optimizationProcess({
                    bootstrap,
                    bootstrapHistory: bootstrapHist,
                    fixtures,
                    last5,
                    picksData: picks || undefined,
                    deltaEvent: 1
                  }).map((dv: any) => {
                    const transfer = transferPlan.find((tp: any) => tp.element == dv.element);
                    return { ...dv, ...transfer }
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
              onClick={() => {
                setDataView(picks?.picks || []);
                setIsOptimize(false);
              }}
            >
              <RefreshCcw className="w-4 h-4" />
            </Button>
          </div>
          <div className="w-full flex justify-end my-3">
            <StatItem
              label={`P${currentEvent.id} - xP${currentEvent.id}`}
              value={totalSurplusXpPrev.toFixed(2)}
              className={`
              ${totalSurplusXpPrev > 0 ? "bg-green-200 text-green-700" : ""
                }
              ${totalSurplusXpPrev < 0 ? "bg-red-200 text-red-700" : ""}
            `}
            />
            <StatItem
              label={isOptimize
                ? `ΣxP${currentEvent.id + 1}*`
                : `ΣxP${currentEvent.id + 1}`}
              value={totalXp.toFixed(2)}
            />
          </div>

        </div>
      )}

      {/* chip usage indicator */}
      <div className="w-full mb-2 ">
        {chip && chip.length > 0 &&
          <div className="flex justify-center">
            <Badge className="flex justify-center items-center text-xs w-3/12 font-semibold bg-slate-800"> {chip} </Badge>

          </div>
        }
      </div>


      {/* pitch view */}
      {manager &&
        <div>
          <div className="bg-green-400 p-5 flex flex-col gap-3">
            {
              played_per_position.map((pp: any) => (
                <ul className="flex gap-1 md:gap-2 justify-evenly items-center mb-2" key={pp.position}>
                  {pp.players.length > 0 && (
                    pp.players.map((pick: PlayerPicked) => (
                      <li key={pick.element}>
                        <CaptaincyBadge player={pick} />
                        {currentEvent.id < 38 &&
                          <AppExpectedPts
                            element={elementMapping(pick.element)}
                            elementHist={bootstrapHist?.elements.find((elh: any) =>
                              elh.code == elementMapping(pick.element).code
                            )}
                            currentEvent={currentEvent}
                            deltaEvent={1}
                            fixtures={fixtures}
                            teams={bootstrap?.teams}
                            multiplier={pick.multiplier}
                            last5={last5 as any}
                            customLabel={elementMapping(pick.element).web_name}
                          />
                        }
                        {currentEvent.id < 38 && <AppNextFixtures
                          teams={bootstrap?.teams}
                          element={elementMapping(pick.element)}
                          nextFixtures={nextFixtures(elementMapping(pick.element))}
                          isSimplify={true}
                        />}
                      </li>
                    ))
                  )}
                </ul>
              ))
            }


          </div>

          <div className="bg-green-700 -mt-5 p-5">
            <div className="w-full flex justify-center items-center my-2">
              <Badge className="flex justify-center items-center text-xs w-3/12 font-semibold bg-slate-800">
                <Armchair className="w-3 h-3 md:m-2" /> Bench
              </Badge>
            </div>

            <ul className="flex gap-1 md:gap-2 justify-evenly items-center">
              {benched.length > 0 && (
                benched.map((pick: PlayerPicked) => (
                  <li key={pick.element}>
                    <CaptaincyBadge player={pick} />
                    {currentEvent.id < 38 && <AppExpectedPts
                      element={elementMapping(pick.element)}
                      elementHist={bootstrapHist?.elements.find((elh: any) =>
                        elh.code == elementMapping(pick.element).code
                      )}
                      currentEvent={currentEvent}
                      deltaEvent={1}
                      fixtures={fixtures}
                      teams={bootstrap?.teams}
                      multiplier={pick.multiplier}
                      last5={last5 as any}
                      customLabel={elementMapping(pick.element).web_name}
                    />
                    }
                    {currentEvent.id < 38 && <AppNextFixtures
                      teams={bootstrap?.teams}
                      element={elementMapping(pick.element)}
                      nextFixtures={nextFixtures(elementMapping(pick.element))}
                      isSimplify={true}
                    />}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      }

      {/* list view */}
      {/* sengaja disabled, tapi masih perlu */}
      {dataView.length < 0 &&
        dataView.map((player: any, index: number) => (
          <div className="w-full" key={index}>
            {/* bench indicator */}
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
                  {/* { !player.transfer ?
                    <AppTransferDialog player={elementMapping(player.element)} currentFixtures={currentFixtures(player)} picks={dataView} onHitTransfer={onHitTransfer} tempBank={setValueTempBank()} last5={last5}/> :
                    <Button className="bg-red-600 text-white text-xs w-6 h-6 p-0" onClick={() => { onClearTransfer(player) }}>
                      <X className="w-4 h-4" />
                    </Button>
                  } */}
                </div>
                <div className="relative w-6 h-6 md:w-12 md:h-12">
                  <Image
                    src={getTeamLogoUrl(elementMapping(player.element).team_code)}
                    fill={true}
                    className="w-6 h-6 md:w-12 md:h-12"
                    sizes="20"
                    alt={`t${elementMapping(player.element).team_code}`}
                  />
                </div>
                <div>
                  <div>
                    <p className="text-xs md:text-sm font-semibold">
                      {elementMapping(player.element).web_name}
                    </p>
                    {
                      player.transfer &&
                      <div className="flex items-center space-x-1 text-xs md:text-sm text-red-400">
                        <ArrowRightLeft className="w-3 h-3" />
                        <p className="text-ellipsis">{elementMapping(player.element_out).web_name}</p>
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
                {/* {currentFixtures(elementMapping(player.element))[0].started
                  ? (
                    <StatItem
                      label={`GW${currentEvent.id}`}
                      value={elementMapping(player.element)?.event_points || 0}
                    />
                  )
                  : (
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
                      last5={last5 as any}
                    />
                  )} */}
                {/* GW onprogress */}
                {currentFixtures(elementMapping(player.element)).length === 0 ?
                  <StatItem
                    label={`P${currentEvent.id}-xP${currentEvent.id}`}
                    value="-"
                  />
                  :
                  <>
                    {currentFixtures(elementMapping(player.element))[0].started
                      ? (
                        <StatItem
                          label={`P${currentEvent.id}-xP${currentEvent.id}`}
                          value={(
                            (elementMapping(player.element)?.event_points || 0) -
                            getXPByElement(player.element, 0)
                          ).toFixed(2)}
                          className={`
                  ${(elementMapping(player.element)?.event_points || 0) -
                              getXPByElement(player.element, 0) >
                              0
                              ? "bg-green-200 text-green-700"
                              : ""
                            }
                  ${elementMapping(player.element).event_points == 0 ||
                              (elementMapping(player.element)?.event_points || 0) -
                              getXPByElement(player.element, 1) <
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
                  </>
                }

                {currentEvent.id < 38 && <AppNextFixtures
                  teams={bootstrap?.teams}
                  element={elementMapping(player.element)}
                  nextFixtures={nextFixtures(elementMapping(player.element))}
                />}

                {currentEvent.id < 38 && <AppExpectedPts
                  element={elementMapping(player.element)}
                  elementHist={bootstrapHist?.elements.find((elh: any) =>
                    elh.code == elementMapping(player.element).code
                  )}
                  currentEvent={currentEvent}
                  deltaEvent={1}
                  fixtures={fixtures}
                  teams={bootstrap?.teams}
                  multiplier={player.multiplier}
                  last5={last5 as any}
                />
                }
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AppMyTeam;

const CaptaincyBadge = (props: any) => {
  const { player } = props;

  return (
    <div className="absolute -mt-3 -ml-3">
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
  )
}

const StatItem = (props: any) => {
  const { className, label, value } = props;
  return (
    <div
      className={`w-14 h-14 md:w-24 md:h-24 p-1 md:p-3 flex flex-col justify-center items-center ${className || ""
        } bg-slate-200`}
    >
      <p className="text-[0.6em] md:text-sm">{label}</p>
      <p className="text-sm md:text-xl font-semibold">{value}</p>
    </div>
  );
};
