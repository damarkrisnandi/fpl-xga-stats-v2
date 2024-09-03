"use client";
import { useState, useEffect } from "react";
import AppInputMyTeam from "./AppInputMyTeam";
import AppSpinner from "./AppSpinner";
import AppExpectedPts from "./AppExpectedPts";
import AppFailedToFetch from "./AppFailedToFetch";
import AppNextFixtures from "./AppNextFixtures"
import {
  getBootstrapFromStorage,
  getFixtures,
  getManagerData,
  getPicksData,
} from "@/services/index";

import { positionMapping, getExpectedPoints, optimizationProcess } from "@/utils/index";
import { Button } from "../ui/button";
import { RefreshCcw, Sparkle } from "lucide-react";

const AppMyTeam = () => {
  const [bootstrap, setBootstrap] = useState<any>(null);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [fixtures, setFixtures] = useState<any>([]);
  const [picks, setPicks] = useState<any>(null);
  const [optimizedPicks, setOptimizedPicks] = useState<any>([]);
  const [manager, setManager] = useState<any>(null);

  const [isOptimize, setIsOptimize] = useState<boolean>(false);

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
        localStorage.getItem("manager_id_stored")
      ) {
        getManagerData(localStorage.getItem('manager_id_stored') || 0).then((value: any) =>{ setManager(value) })
        setDataPicks();
      }

      if (bootstrap && !bootstrap.error && fixtures.length && !fixtures[0].error && manager && !manager.error && picks && !picks.error && optimizedPicks.length == 0) {
        setOptimizedPicks(optimizationProcess(bootstrap.elements, fixtures, bootstrap.teams, currentEvent, 0, manager, picks));
      }
    }
  }, [bootstrap, fixtures, manager, picks]);
  if (!bootstrap) {
    return (
      <div className="flex justify-center items-center h-screen">
        <AppSpinner />
      </div>
    );
  }

  if (bootstrap && bootstrap.error) {
    return (
      <div className="flex justify-center items-center h-screen">
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
    setPicks(null)
  }

  const setDataPicks = () => {
    const managerId = localStorage.getItem("manager_id_stored") || '0';
    getPicksData(managerId, currentEvent.id).then((value) => setPicks(value));
  };

  const elementMapping = (id: number) => bootstrap.elements.find((el: any) => el.id == id);

  const nextFixtures = (element: any) => fixtures.filter((fix: any) => fix.event == currentEvent.id + 1 && (fix.team_h == element.team || fix.team_a == element.team) );

  return (
    <div className="w-11/12 md:w-5/12">
      <AppInputMyTeam onFindMyTeam={handleFindMyTeam} onRemoveMyTeam={handleRemoveMyTeam} />
      <div className="flex space-x-1 w-full">
       <Button className="text-xs" variant={'outline'} onClick={() => setIsOptimize(true)}><Sparkle/> Optimize</Button>
       <Button className="text-xs" variant={'outline'} onClick={() => setIsOptimize(false)}><RefreshCcw/></Button> 
      </div>
      {picks && optimizedPicks.length &&
        (isOptimize ? optimizedPicks : picks.picks).map((player: any) => (
          <div className="w-full flex justify-between bg-slate-200" key={player.element}>
            <div
              className={`w-28 h-14 md:w-48 md:h-24 py-1 px-3 md:py-3 md:px-5 flex justify-start items-center bg-slate-200 space-x-2`}
            >
              <p className="text-xs md:text-sm font-semibold">
                {elementMapping(player.element).web_name} |
                {positionMapping(elementMapping(player.element).element_type)}
              </p>
            </div>
            <div className="flex justify-end">
              <StatItem label={`GW${currentEvent.id}`} value={elementMapping(player.element).event_points}/>
              <StatItem label={`P${currentEvent.id}-xP${currentEvent.id}`} 
            value={(elementMapping(player.element).event_points - getExpectedPoints(elementMapping(player.element), currentEvent.id, -1, fixtures, bootstrap?.teams)).toFixed(2)} 
            className={`
            ${
              (elementMapping(player.element).event_points - getExpectedPoints(elementMapping(player.element), currentEvent.id, -1, fixtures, bootstrap?.teams)) > 0
                ? "bg-green-200 text-green-700"
                : ""
            }
            ${
              elementMapping(player.element).event_points == 0 || (elementMapping(player.element).event_points - getExpectedPoints(elementMapping(player.element), currentEvent.id, -1, fixtures, bootstrap?.teams)) < 0
                ? "bg-red-200 text-red-700"
                : ""
            }
            `}
            /> 
            <AppNextFixtures teams={bootstrap?.teams} element={elementMapping(player.element)} nextFixtures={nextFixtures(elementMapping(player.element))}/>

            <AppExpectedPts
            element={elementMapping(player.element)}
            currentEvent={currentEvent}
            deltaEvent={0}
            fixtures={fixtures}
            teams={bootstrap?.teams}
            />
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
      <p className="text-xs md:text-sm">{label}</p>
      <p className="text-sm md:text-xl font-semibold">{value}</p>
    </div>
  );
};
