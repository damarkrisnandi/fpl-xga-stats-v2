"use client";
import { BadgePlus, ChevronLeft, Clock, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
// import { statsMapping } from "@/utils";
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
                                  .find((expl: any) =>
                                    expl.fixture == fixture.id
                                  )
                                  ?.stats.find(
                                    (stat: any) => stat.identifier == "minutes",
                                  )?.value > 0,
                          )
                        )
                        .toSorted((a: any, b: any) =>
                          a.element_type - b.element_type
                        )
                        .map((el: any) => {
                          return {
                            ...el,
                            live_stats: liveEvent.elements
                              .find((le: any) => le.id == el.id)
                              .explain.find(
                                (expl: any) => expl.fixture == fixture.id,
                              ).stats,
                          };
                        })
                        .map((el: any) => (
                          <div className="flex justify-start" key={el.id}>
                            <p className="mr-2">{el.web_name}</p>
                            <span
                              className={`bg-blue-200 flex items-center px-1`}
                            >
                              { statsMapping("minutes", el.live_stats.find(
                                  (stat: any) =>
                                    stat.identifier == "minutes",
                                )?.value)}
                            </span>
                            {el.live_stats
                              .filter(
                                (stat: any) =>
                                  stat.identifier !== "minutes" &&
                                  stat.identifier !== "bonus",
                              )
                              .map((stat: any, i: number) => (
                                <span className="flex items-center" key={i}>
                                  {Array.from(
                                    { length: stat.value },
                                    (_, index) =>
                                      index + 1,
                                  ).map((val: number) => (
                                    <div className="" key={val}>
                                      {statsMapping(stat.identifier)}
                                    </div>
                                  ))}
                                </span>
                              ))}
                            {el.live_stats.find(
                              (stat: any) => stat.identifier == "bonus",
                            ) && (
                              <span
                                className={`bg-green-300 flex items-center px-1`}
                              >
                                <Sparkles className="text-yellow-500 w-3 h-3" />
                                <p>
                                  {el.live_stats.find(
                                    (stat: any) => stat.identifier == "bonus",
                                  )?.value}
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
                                  .find((expl: any) =>
                                    expl.fixture == fixture.id
                                  )
                                  ?.stats.find(
                                    (stat: any) => stat.identifier == "minutes",
                                  )?.value > 0,
                          )
                        )
                        .toSorted((a: any, b: any) =>
                          a.element_type - b.element_type
                        )
                        .map((el: any) => {
                          return {
                            ...el,
                            live_stats: liveEvent.elements
                              .find((le: any) => le.id == el.id)
                              .explain.find(
                                (expl: any) => expl.fixture == fixture.id,
                              ).stats,
                          };
                        })
                        .map((el: any) => (
                          <div className="flex justify-end" key={el.id}>
                            <span
                              className={`bg-blue-200 flex items-center px-1`}
                            >
                              { statsMapping("minutes", el.live_stats.find(
                                  (stat: any) =>
                                    stat.identifier == "minutes",
                                )?.value)}
                              
                            </span>
                            {el.live_stats
                              .filter(
                                (stat: any) =>
                                  stat.identifier !== "minutes" &&
                                  stat.identifier !== "bonus",
                              )
                              .map((stat: any, i: number) => (
                                <span className="flex items-center" key={i}>
                                  {Array.from(
                                    { length: stat.value },
                                    (_, index) =>
                                      index + 1,
                                  ).map((val: number) => (
                                    <div className="" key={val}>
                                      {statsMapping(stat.identifier)}
                                    </div>
                                  ))}
                                </span>
                              ))}
                            {el.live_stats.find(
                              (stat: any) => stat.identifier == "bonus",
                            ) && (
                              <span
                                className={`bg-green-300 flex items-center px-1`}
                              >
                                <Sparkles className="text-yellow-500 w-3 h-3" />
                                <p>
                                  {el.live_stats.find(
                                    (stat: any) => stat.identifier == "bonus",
                                  )?.value}
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

function statsMapping(code: string, value?:any): any {
  const stats: any = {
    minutes: <IconBxTimeFive time={value}/>,
    goals_scored: <IconBxFootball />,
    assists: <IconShoeCleat />,
    clean_sheets: <IconShieldShaded />,
    goals_conceded: <IconClipboardXFill className="text-red-500" />,
    own_goals: <IconBallFootballOff className="text-red-500"/>,
    penalties_saved: "PS",
    penalties_missed: "PM",
    yellow_cards: <IconCard className="text-yellow-500"/>,
    red_cards: <IconCard className="text-red-500" />,
    saves: <IconHands />,
    bonus: <IconTrophyAward />,
    bps: "BPS",
  };
  return stats[code] || "";
}

function IconBxFootball(props: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1.5em"
      width="1.5em"
      {...props}
    >
      <path d="M19.071 4.929a9.936 9.936 0 00-7.07-2.938 9.943 9.943 0 00-7.072 2.938c-3.899 3.898-3.899 10.243 0 14.142a9.94 9.94 0 007.073 2.938 9.936 9.936 0 007.07-2.937c3.899-3.898 3.899-10.243-.001-14.143zM12.181 4h-.359c.061-.001.119-.009.18-.009s.118.008.179.009zm6.062 13H16l-1.258 2.516a7.956 7.956 0 01-2.741.493 7.96 7.96 0 01-2.746-.494L8 17.01H5.765a7.96 7.96 0 01-1.623-3.532L6 11 4.784 8.567a7.936 7.936 0 011.559-2.224 7.994 7.994 0 013.22-1.969L12 6l2.438-1.625a8.01 8.01 0 013.22 1.968 7.94 7.94 0 011.558 2.221L18 11l1.858 2.478A7.952 7.952 0 0118.243 17z" />
      <path d="M8.5 11l1.5 4h4l1.5-4L12 8.5z" />
    </svg>
  );
}

function IconBallFootballOff(props: any) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      height="1.5em"
      width="1.5em"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M20.041 16.046A9 9 0 007.957 3.956M5.634 5.639a9 9 0 0012.726 12.73" />
      <path d="M12 7l4.755 3.455-.566 1.743-.98 3.014L15 16H9l-1.755-5.545 1.86-1.351 2.313-1.681zM12 7V3M15 16l2.5 3M16.755 10.455L20.5 9M9.061 16.045L6.5 19M7.245 10.455L3.5 9M3 3l18 18" />
    </svg>
  );
}

function IconShieldShaded(props: any) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1.5em"
      width="1.5em"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M8 14.933a.615.615 0 00.1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 002.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 00-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067v13.866zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 011.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 01-2.517 2.453 7.159 7.159 0 01-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 01-1.048-.625 11.777 11.777 0 01-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 012.185 1.43 62.456 62.456 0 015.072.56z"
      />
    </svg>
  );
}

function IconShoeCleat(props: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1.5em"
      width="1.5em"
      {...props}
    >
      <path d="M21 8h-.7l-.05-.03c-2.11-.13-3.87-.8-4.72-1.74L14 7c-.05.1-.11.19-.16.28.71.61 1.16 1.37 1.16 2.22 0 .33-.09.64-.21.95l-1.87-1.87c-.22.25-.45.49-.7.71l2.03 2.03c-.21.25-.45.47-.75.68l-2.07-2.09c-.29.2-.58.37-.88.54l2.03 2.05c-.33.13-.69.24-1.08.32l-1.91-1.91c-.34.14-.68.27-1.03.38l1.7 1.71H10c-1.5 0-2.8-.46-3.72-1.18-.82.13-1.6.18-2.28.18-2 0-2 3-2 3 0 1.11.89 2 2 2v1c0 .55.45 1 1 1s1-.45 1-1v-1h1v1c0 .55.45 1 1 1s1-.45 1-1v-1h1v1c0 .55.45 1 1 1s1-.45 1-1v-1h3v1c0 .55.45 1 1 1s1-.45 1-1v-1h1v1c0 .55.45 1 1 1s1-.45 1-1v-1h1s1 0 1-4.5C22 9 21 8 21 8z" />
    </svg>
  );
}

function IconCard(props: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1.5em"
      width="1.5em"
      {...props}
    >
      <path d="M7 12c2.2 0 4-1.8 4-4S9.2 4 7 4 3 5.8 3 8s1.8 4 4 4m4 8v-5.3c-1.1-.4-2.5-.7-4-.7-3.9 0-7 1.8-7 4v2h11m4-16c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-7z" />
    </svg>
  );
}

function IconHands(props: any) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1.5em"
      width="1.5em"
      {...props}
    >
      <path d="M154.9 162c.3.7.7 1.5 1.1 2.2l17.8 30.9c11.1-12.6 27.4-19.8 44.4-19.1l-20.7-35.8c-6.6-11.5-21.3-15.4-32.8-8.8-10.8 6.2-14.9 19.5-9.9 30.6zm173.6 47C399.7 231.7 448 297.8 448 372.5c0 1.5 0 3-.1 4.5 39.7-25.6 64.1-69.7 64.1-117.4V136c0-13.3-10.7-24-24-24s-24 10.7-24 24v81.7L347.8 16.5C341.2 5 326.5 1.1 315.1 7.7s-15.4 21.3-8.8 32.8l64 110.9c2.2 3.8.9 8.7-2.9 10.9s-8.7.9-10.9-2.9l-80-138.6c-6.7-11.5-21.4-15.4-32.9-8.8s-15.4 21.3-8.8 32.8l80 138.6c2.2 3.8.9 8.7-2.9 10.9s-8.7.9-10.9-2.9L237 80.5c-6.6-11.5-21.3-15.4-32.8-8.8s-15.4 21.3-8.8 32.8l44 76.2 89.1 28.3zM64 488c0 12.4 9.4 22.6 21.5 23.9.8.1 1.6.1 2.5.1h208c66.3 0 120-53.7 120-120 0-1.2 0-2.4-.1-3.6 0-1.2.1-2.5.1-3.7 0-68-44-128.2-108.9-148.9l-83.9-26.7c-12.6-4-26.1 3-30.1 15.6s3 26.1 15.6 30.1l53.9 17.2H56c-13.3 0-24 10.7-24 24s10.7 24 24 24h128c4.4 0 8 3.6 8 8s-3.6 8-8 8H24c-13.3 0-24 10.7-24 24s10.7 24 24 24h160c4.4 0 8 3.6 8 8s-3.6 8-8 8H56c-13.3 0-24 10.7-24 24s10.7 24 24 24h128c4.4 0 8 3.6 8 8s-3.6 8-8 8H88c-13.3 0-24 10.7-24 24z" />
    </svg>
  );
}

function IconClipboardXFill(props: any) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1.5em"
      width="1.5em"
      {...props}
    >
      <path d="M6.5 0A1.5 1.5 0 005 1.5v1A1.5 1.5 0 006.5 4h3A1.5 1.5 0 0011 2.5v-1A1.5 1.5 0 009.5 0h-3zm3 1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5h3z" />
      <path d="M4 1.5H3a2 2 0 00-2 2V14a2 2 0 002 2h10a2 2 0 002-2V3.5a2 2 0 00-2-2h-1v1A2.5 2.5 0 019.5 5h-3A2.5 2.5 0 014 2.5v-1zm4 7.793l1.146-1.147a.5.5 0 11.708.708L8.707 10l1.147 1.146a.5.5 0 01-.708.708L8 10.707l-1.146 1.147a.5.5 0 01-.708-.708L7.293 10 6.146 8.854a.5.5 0 11.708-.708L8 9.293z" />
    </svg>
  );
}

function IconBxTimeFive(props: any) {
  return (
    <span className="flex items-start"  >
      <p className="text-[0.8em]">{props?.time}</p>

      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        height="1.5em"
        width="1.5em"
        {...props}
      >
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
        <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z" />
    
      </svg>
    </span>
  );
}

function IconTrophyAward(props: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M15.2 10.7l1.4 5.3-4.6-3.8L7.4 16l1.4-5.2-4.2-3.5L10 7l2-5 2 5 5.4.3-4.2 3.4M14 19h-1v-3l-1-1-1 1v3h-1c-1.1 0-2 .9-2 2v1h8v-1a2 2 0 00-2-2z" />
    </svg>
  );
}

export default AppLiveEvent;
