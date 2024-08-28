"use client";
import { Clock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { useEffect, useState } from "react";
import {
  getBootstrap,
  getBootstrapFromStorage,
  getFixtures,
  getLiveEventData,
} from "@/services";
import AppScoreBoard from "./AppScoreboard";
import AppFailedToFetch from "./AppFailedToFetch";
import { Separator } from "@radix-ui/react-select";
import { statsMapping } from "@/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const AppLiveEvent = () => {
  const [bootstrap, setBootstrap] = useState<any>(null);
  const [fixtures, setFixtures] = useState<any>([]);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [liveEvent, setLiveEvent] = useState<any>(null);

  const getTeamShort = (code: number) => {
    return (
      bootstrap?.teams.find((team: any) => team.id === code)?.short_name || ""
    );
  };

  useEffect(() => {
    if (!bootstrap) {
      getBootstrapFromStorage().then((data: any) => {
        setBootstrap(data);
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

      if (fixtures.length && !fixtures.error && currentEvent && !liveEvent) {
        getLiveEventData(currentEvent?.id).then((live: any) => {
          setLiveEvent(live);
        });
      }
    }
  }, [bootstrap, fixtures, liveEvent]);

  if (!bootstrap) {
    return (
      <div className="pt-24">
        <p>Please wait...</p>
      </div>
    );
  }
  if (bootstrap && bootstrap.error) {
    return <AppFailedToFetch />;
  }

  if (fixtures.length === 0) {
    return (
      <div className="pt-24">
        <p>Please wait...</p>
      </div>
    );
  }

  if (fixtures.length && fixtures[0].error) {
    return <AppFailedToFetch />;
  }

  if (!liveEvent) {
    return (
      <div className="pt-24">
        <p>Please wait...</p>
      </div>
    );
  }

  if (liveEvent && liveEvent.error) {
    return <AppFailedToFetch />;
  }
  return (
    <Card className="w-11/12 md:w-5/12 mb-2">
      <CardHeader>
        <CardTitle>
          <span className="flex items-center space-x-10">
            <p className="mr-1">
              Live Event {currentEvent ? ": Gameweek " + currentEvent.id : ""}
            </p>
            <Clock />
          </span>
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="">
        {fixtures
          .filter((fixture: any) => fixture.event == currentEvent?.id)
          .map((fixture: any) => (
            <div key={fixture.id}>
              <div
                className="flex justify-center items-center space-x-2 mb-2"
                key={fixture.id}
              >
                <div className="flex justify-end items-center">
                  <p className="w-10 text-right text-sm font-semibold mr-3">  
                    {getTeamShort(fixture.team_h)}
                  </p>
                  <AppScoreBoard score={fixture.team_h_score} />
                </div>
                
                <div className="flex justify-start items-center">
                  <AppScoreBoard score={fixture.team_a_score} />
                  <p className="w-10 text-left text-sm font-semibold ml-3">
                    {getTeamShort(fixture.team_a)}
                  </p>
                </div>
              </div>
              <Tabs defaultValue="home" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value={"home"} className="w-full">
                    {getTeamShort(fixture.team_h)}
                  </TabsTrigger>

                  <TabsTrigger value={"away"} className="w-full">
                    {getTeamShort(fixture.team_a)}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="home" className="py-7">
                  <div className="w-full flex justify-between m-auto">
                    <div className="text-xs">
                      {bootstrap?.elements
                        .filter((el: any) => el.team == fixture.team_h)

                        .filter((el: any) =>
                          liveEvent.elements.find(
                            (le: any) =>
                              le.id == el.id &&
                              le.explain.length &&
                              le.explain
                                .find((expl: any) => expl.fixture == fixture.id)
                                ?.stats.find(
                                  (stat: any) => stat.identifier == "minutes"
                                )?.value > 0
                          )
                        )
                        .map((el: any) => {
                          return {
                            ...el,
                            live_stats: liveEvent.elements
                              .find((le: any) => le.id == el.id)
                              .explain.find(
                                (expl: any) => expl.fixture == fixture.id
                              ).stats,
                          };
                        })
                        .map((el: any) => (
                          <div className="flex justify-start" key={el.id}>
                            <p className="mr-2">{el.web_name}</p>
                            {el.live_stats.map((stat: any, i: number) => (
                              <p className="mr-1" key={i}>
                                {statsMapping(stat.identifier)}{stat.value} 
                              </p>
                            ))}
                          </div>
                        ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="away" className="py-7">
                  <div className="w-full flex justify-end m-auto">
                    <div className="text-xs text-right">
                      {bootstrap?.elements
                        .filter((el: any) => el.team == fixture.team_a)

                        .filter((el: any) =>
                          liveEvent.elements.find(
                            (le: any) =>
                              le.id == el.id &&
                              le.explain.length &&
                              le.explain
                                .find((expl: any) => expl.fixture == fixture.id)
                                ?.stats.find(
                                  (stat: any) => stat.identifier == "minutes"
                                )?.value > 0
                          )
                        )
                        .map((el: any) => {
                          return {
                            ...el,
                            live_stats: liveEvent.elements
                              .find((le: any) => le.id == el.id)
                              .explain.find(
                                (expl: any) => expl.fixture == fixture.id
                              ).stats,
                          };
                        })
                        .map((el: any) => (
                          <div className="flex justify-end" key={el.id}>
                            {el.live_stats.map((stat: any, i: number) => (
                              <p className="ml-1" key={i}>
                                {statsMapping(stat.identifier)}{stat.value}
                              </p>
                            ))}
                            <p className="ml-2">{el.web_name}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Separator className="w-11/12" />
            </div>
          ))}
      </CardContent>
    </Card>
  );
};

export default AppLiveEvent;
