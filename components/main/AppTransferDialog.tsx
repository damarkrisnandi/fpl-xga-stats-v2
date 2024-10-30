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
import { Armchair, RefreshCcw, Sparkle, Sparkles, ArrowDownUp, X, MoveUp } from "lucide-react";
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
  getManagerTransferData
} from "@/services/index";
import AppElements from "./AppElements";
import { ScrollArea } from "../ui/scroll-area";

export default function AppTransferDialog({ player, picks}: any) {
    const [bootstrap, setBootstrap] = useState<any>(null);
  const [bootstrapHist, setBootstrapHist] = useState<any>(null);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [fixtures, setFixtures] = useState<any>([]);
  const [manager, setManager] = useState<any>(null);
  const [filterName, setFilterName] = useState<string>('');
  
  const [transferIn, setTransferIn] = useState<any>(null);
  const [prevTransfer, setPrevTransfer] = useState<any[]>([]);

  const [open, setOpen] = useState(false)

  const setDataPicks = () => {
    getManagerData(localStorage.getItem("manager_id_stored") || 0).then(
      (value: any) => {
        setManager(value);
        
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

      if (!manager) {
        getManagerData(localStorage.getItem("manager_id_stored") || 0).then(
            (value: any) => {
                setManager(value);
                
            }
        );
      }

      if (prevTransfer.length == 0) {
        getManagerTransferData(localStorage.getItem("manager_id_stored") || 0).then(
            (value: any) => {
                setPrevTransfer(value);
            }
        )
      }

    }
  }, [bootstrap, bootstrapHist, fixtures, manager, prevTransfer]);

    // useEffect(() => {
    //     console.log('cekk', elements)
    // }, [elements])
  if (!bootstrap) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <Button className="bg-black text-white text-xs w-6 h-6 p-0" disabled={true}>
            <ArrowDownUp className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  if (!currentEvent) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <Button className="bg-black text-white text-xs w-6 h-6 p-0" disabled={true}>
            <ArrowDownUp className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  if (!manager) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <Button className="bg-black text-white text-xs w-6 h-6 p-0" disabled={true}>
            <ArrowDownUp className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  if (prevTransfer.length == 0) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <Button className="bg-black text-white text-xs w-6 h-6 p-0" disabled={true}>
            <ArrowDownUp className="w-4 h-4" />
        </Button>
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
        <Button className="bg-black text-white text-xs w-6 h-6 p-0" disabled={true}>
            <ArrowDownUp className="w-4 h-4" />
        </Button>
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
        (fix.team_h == element.team || fix.team_a == element.team),
    );

  const currentFixtures = (element: any) =>
    fixtures.filter(
      (fix: any) =>
        fix.event == currentEvent.id &&
        (element.team == fix.team_h || element.team == fix.team_a),
    );

    const setTransferFee = (player: any) => {
        if (!prevTransfer) {
            return 0
        }
        let transferFee = 0;
        const lastValueOnBuy = prevTransfer.filter((t: any) => t.element_in == player.id)[0]?.element_in_cost || (player.now_cost - player.cost_change_start);
        if (player.now_cost > lastValueOnBuy) {
            transferFee = Math.floor((player.now_cost - lastValueOnBuy) / 2);
        }

        return transferFee;
    } 
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black text-white text-xs w-6 h-6 p-0"  >
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
                <StatItem label="COST" value={((player.now_cost - setTransferFee(player)) / 10).toFixed(1)}/>
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
        <div className="w-full flex space-x-1">
            <StatItem label="Bank" value={((player.now_cost - setTransferFee(player) + manager.last_deadline_bank - (transferIn?.now_cost || 0)) / 10).toFixed(1)}/>
            {
                transferIn && (
                    <div className="w-full flex justify-between bg-slate-200" key={player.id}>
                    <div className={`w-full h-14 md:w-full md:h-24 py-1 px-3 md:py-3 md:px-5 flex justify-start items-center bg-slate-200 space-x-2`}>
                        <Button className="bg-red-600 text-white text-xs w-6 h-6 p-0" onClick={() => { setTransferIn(null) }}>
                            <X className="w-4 h-4" />
                        </Button>
                        <div>
                            <p className="text-xs md:text-sm font-semibold">
                            {transferIn.web_name}
                            </p>
                            <p className="text-xs font-light">
                            {positionMapping(
                                transferIn.element_type,
                            )}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <StatItem label="COST" value={(transferIn.now_cost / 10).toFixed(1)}/>
                        <AppNextFixtures
                        teams={bootstrap?.teams}
                        element={transferIn}
                        nextFixtures={nextFixtures(transferIn)}
                        />

                        <AppExpectedPts
                        element={transferIn}
                        elementHist={bootstrapHist?.elements.find((elh: any) =>
                            elh.code == transferIn.code
                        )}
                        currentEvent={currentEvent}
                        deltaEvent={0}
                        fixtures={fixtures}
                        teams={bootstrap?.teams}
                        multiplier={transferIn.multiplier}
                        />
                    </div>
                </div>
                )
            }
        </div>        
        <Input type="text" placeholder="Find By Name" onChange={(evt) => {setFilterName(evt.target.value)}}/>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
        {
            bootstrap?.elements
            .filter(({ element_type, id }: any) => player.id !== id && player.element_type == element_type)
            .filter(({ web_name }: any) => web_name.toLowerCase().startsWith(filterName.toLowerCase()))
            .toSorted(
                (a: any, b: any) =>
                  b.total_points -
                  a.total_points,
              )
            .map((player: any) => (
                <div className="w-full flex justify-between bg-slate-200" key={player.id}>
                    <div className={`w-full h-14 md:w-full md:h-24 py-1 px-3 md:py-3 md:px-5 flex justify-start items-center bg-slate-200 space-x-2`}>
                        <Button className="bg-green-600 text-white text-xs w-6 h-6 p-0" disabled={picks.map((pick: any) => pick.element).includes(player.id)} 
                        onClick={() => { setTransferIn(player) }}>
                            <MoveUp className="w-4 h-4" />
                        </Button>
                        {/* <div className="relative w-6 h-6 md:w-12 md:h-12">
                            <Image
                            src={getTeamLogoUrl(player.team_code)}
                            fill={true}
                            className="w-6 h-6 md:w-12 md:h-12"
                            sizes="20"
                            alt={`t${player.team_code}`}
                            />
                        </div> */}
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
          <Button type="submit" onClick={() => { setOpen(false) }}>Save changes</Button>
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
