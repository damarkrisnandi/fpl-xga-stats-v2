"use client";
import { BadgePlus, ChevronLeft, Clock, Sparkles } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
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
import { Button } from "../ui/button";
import Link from "next/link";
import AppSpinner from "./AppSpinner";

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

  const getTeamName = (code: number) => {
    return bootstrap?.teams.find((team: any) => team.id === code)?.name || "";
  };

  useEffect(() => {
    if (!bootstrap) {
      getBootstrapFromStorage().then((data: any) => {
        setBootstrap(data);
      });
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

      if (fixtures.length && !fixtures.error && currentEvent && !liveEvent) {
        getLiveEventData(currentEvent?.id).then((live: any) => {
          setLiveEvent(live);
        });
      }
    }
  }, [bootstrap, fixtures, liveEvent, currentEvent]);

  if (!bootstrap) {
    return (
      <div className="pt-24">
        <AppSpinner />
      </div>
    );
  }
  if (bootstrap && bootstrap.error) {
    return <AppFailedToFetch />;
  }

  if (fixtures.length === 0) {
    return (
      <div className="pt-24">
        <AppSpinner />
      </div>
    );
  }

  if (fixtures.length && fixtures[0].error) {
    return <AppFailedToFetch />;
  }

  if (!liveEvent) {
    return (
      <div className="pt-24">
        <AppSpinner />
      </div>
    );
  }

  if (liveEvent && liveEvent.error) {
    return <AppFailedToFetch />;
  }
  return (
    <Card className="w-11/12 md:w-5/12 mb-2">
      <CardHeader>
        <Button asChild variant={"outline"} className="mb-7">
          <Link href={`/`}>
            <ChevronLeft /> Back to Home
          </Link>
        </Button>

        <CardTitle>
          <span className="flex items-center space-x-2">
            <p className="text-lg">
              Live Event {currentEvent ? ": GW" + currentEvent.id : ""}
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
                  <AppScoreBoard score={fixture.team_h_score || 0} />
                </div>

                <div className="flex justify-start items-center">
                  <AppScoreBoard score={fixture.team_a_score || 0} />
                  <p className="w-10 text-left text-sm font-semibold ml-3">
                    {getTeamShort(fixture.team_a)}
                  </p>
                </div>
              </div>
              <Tabs defaultValue="home" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value={"home"} className="w-full">
                    {getTeamName(fixture.team_h)}
                  </TabsTrigger>

                  <TabsTrigger value={"away"} className="w-full">
                    {getTeamName(fixture.team_a)}
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
                        .toSorted((a: any, b: any) => a.element_type - b.element_type)
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
                            <span
                              className={`bg-blue-200 flex items-center px-1`}
                            >
                              <Clock className="h-3 w-3" />
                              <p>
                                {
                                  el.live_stats.find(
                                    (stat: any) => stat.identifier == "minutes"
                                  )?.value
                                }
                                &apos;
                              </p>
                            </span>
                            {el.live_stats
                              .filter(
                                (stat: any) =>
                                  stat.identifier !== "minutes" &&
                                  stat.identifier !== "bonus"
                              )
                              .map((stat: any, i: number) => (
                                <span className="flex items-center" key={i}>
                                  {Array.from(
                                    { length: stat.value },
                                    (_, index) => index + 1
                                  ).map((val: number) => (
                                    <p className="" key={val}>
                                      {statsMapping(stat.identifier)}
                                    </p>
                                  ))}
                                </span>
                              ))}
                            {el.live_stats.find(
                              (stat: any) => stat.identifier == "bonus"
                            ) && (
                              <span
                                className={`bg-green-300 flex items-center px-1`}
                              >
                                <Sparkles className="text-yellow-500 w-3 h-3" />
                                <p>
                                  {
                                    el.live_stats.find(
                                      (stat: any) => stat.identifier == "bonus"
                                    )?.value
                                  }
                                </p>
                              </span>
                            )}
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
                        .toSorted((a: any, b: any) => a.element_type - b.element_type)
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
                            <span
                              className={`bg-blue-200 flex items-center px-1`}
                            >
                              <Clock className="h-3 w-3" />
                              <p>
                                {
                                  el.live_stats.find(
                                    (stat: any) => stat.identifier == "minutes"
                                  )?.value
                                }
                                &apos;
                              </p>
                            </span>
                            {el.live_stats
                              .filter(
                                (stat: any) =>
                                  stat.identifier !== "minutes" &&
                                  stat.identifier !== "bonus"
                              )
                              .map((stat: any, i: number) => (
                                <span className="flex items-center" key={i}>
                                  {Array.from(
                                    { length: stat.value },
                                    (_, index) => index + 1
                                  ).map((val: number) => (
                                    <p className="" key={val}>
                                      {statsMapping(stat.identifier)}
                                    </p>
                                  ))}
                                </span>
                              ))}
                            {el.live_stats.find(
                              (stat: any) => stat.identifier == "bonus"
                            ) && (
                              <span
                                className={`bg-green-300 flex items-center px-1`}
                              >
                                <Sparkles className="text-yellow-500 w-3 h-3" />
                                <p>
                                  {
                                    el.live_stats.find(
                                      (stat: any) => stat.identifier == "bonus"
                                    )?.value
                                  }
                                </p>
                              </span>
                            )}
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
      <CardFooter>
        <Button asChild variant={"outline"} className="w-full">
          <Link href={`/`}>
            <ChevronLeft /> Back to Home
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AppLiveEvent;
