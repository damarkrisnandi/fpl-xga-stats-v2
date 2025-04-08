"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { getBootstrapFromStorage, getFixtures } from "@/services";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import AppScoreBoard from "./AppScoreboard";
import AppFailedToFetch from "./AppFailedToFetch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import {
  QueryClient,
  QueryClientProvider,
  useQueries,
  useQuery,
} from "@tanstack/react-query";
import useBootstrap from "@/hooks/use-bootstrap";
import useFixtures from "@/hooks/use-fixtures";
import useCurrentEvent from "@/hooks/use-currentevent";
import useNextEvent from "@/hooks/use-nextevent";

const AppFixtures = (props: any) => {
  const queryClient = new QueryClient();

  const { bootstrap, isLoadingBootstrap, errorBootstrap } = useBootstrap();
  const { fixtures, isLoadingFixtures, errorFixtures } = useFixtures();
 
  const { teams, events, elements, element_stats } = bootstrap;
  const { currentEvent } = useCurrentEvent({ bootstrap });
  const { nextEvent } = useNextEvent({ bootstrap });

  const getTeamShort = (code: number) => {
    return teams.find((team: any) => team.id === code)?.short_name || "";
  }; 

  if (isLoadingBootstrap || isLoadingFixtures) {
    return <SkeletonFixtures />;
  }

  if (errorBootstrap || errorFixtures) {
    return <AppFailedToFetch />;
  }

  return (
    <Tabs defaultValue="current" className="w-11/12 md:w-5/12 mb-2">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="current">Current</TabsTrigger>
        {nextEvent ? <TabsTrigger value="next">Next</TabsTrigger> : null}
      </TabsList>
      <TabsContent value="current">
        <Card>
          <CardHeader>
            <CardTitle>{currentEvent?.name}</CardTitle>
            <CardDescription>
              Results of the {currentEvent?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Accordion type="single" collapsible className="w-full">
              {fixtures
                .filter((fixture: any) => fixture.event == currentEvent?.id)
                .map((fixture: any) => (
                  <AccordionItem key={fixture.id} value={fixture.id}>
                    <AccordionTrigger className="w-full">
                      <div className="w-full flex justify-center items-center space-x-2">
                        <div className="flex justify-end items-center">
                          <p className="w-10 text-right text-sm font-semibold mr-3">
                            {getTeamShort(fixture.team_h)}
                          </p>
                          {fixture.started
                            ? (
                              <AppScoreBoard
                                score={fixture.team_h_score || 0}
                                className={` ${
                                  !fixture.finished ? "bg-[#37003c]" : ""
                                } `}
                              />
                            )
                            : null}
                        </div>
                        {!fixture.started
                          ? <AppScoreBoard score={"v"} />
                          : null}
                        <div className="flex justify-start items-center">
                          {fixture.started
                            ? (
                              <AppScoreBoard
                                score={fixture.team_a_score || 0}
                                className={` ${
                                  !fixture.finished ? "bg-[#37003c]" : ""
                                } `}
                              />
                            )
                            : null}
                          <p className="w-10 text-left text-sm font-semibold ml-3">
                            {getTeamShort(fixture.team_a)}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {fixture.stats
                        .filter(
                          (stat: any) => stat.a.length > 0 || stat.h.length > 0,
                        )
                        .map((stat: any) => (
                          <div key={stat.identifier}>
                            <div className="w-full p-1 flex justify-center items-center bg-slate-200 text-xs">
                              <p className="font-semibold">
                                {element_stats.find(
                                  (es: any) => es.name == stat.identifier,
                                )?.label || '-'}
                              </p>
                            </div>
                            <div className="w-full flex justify-between m-auto">
                              <div className="">
                                {stat.h
                                  .filter((home: any, index: number) => {
                                    if (stat.identifier == "bps") {
                                      return index < 5;
                                    }
                                    return home;
                                  })
                                  .map((home: any) => (
                                    <div
                                      key={home.element}
                                      className="flex text-xs"
                                    >
                                      <p>
                                        {elements.find(
                                          (el: any) => el.id == home.element,
                                        )?.web_name || '-'}
                                      </p>
                                      <p className="ml-1">({home.value})</p>
                                    </div>
                                  ))}
                              </div>
                              <div className="">
                                {stat.a
                                  .filter((away: any, index: number) => {
                                    if (stat.identifier == "bps") {
                                      return index < 5;
                                    }
                                    return away;
                                  })
                                  .map((away: any) => (
                                    <div
                                      key={away.element}
                                      className="flex text-xs justify-end"
                                    >
                                      <p className="mr-1">({away.value})</p>
                                      <p>
                                        {elements.find(
                                          (el: any) => el.id == away.element,
                                        )?.web_name || '-'}
                                      </p>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
            <Button asChild variant={"outline"} className="w-full">
              <Link href={`/live-event`}>
                Live Event{" "}
                <span className="w-2 h-2 bg-green-500 rounded-full m-2"></span>
              </Link>
            </Button>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="next">
        <Card>
          <CardHeader>
            <CardTitle>{nextEvent?.name}</CardTitle>
            <CardDescription>{nextEvent?.name} fixtures</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {fixtures
              .filter((fixture: any) => fixture.event == nextEvent?.id)
              .map((fixture: any) => (
                <div
                  className="flex justify-center items-center space-x-2"
                  key={fixture.id}
                >
                  <div className="flex justify-end items-center">
                    <p className="w-10 text-right text-sm font-semibold mr-3">
                      {getTeamShort(fixture.team_h)}
                    </p>
                  </div>
                  <AppScoreBoard score={"v"} />
                  <div className="flex justify-start items-center">
                    <p className="w-10 text-left text-sm font-semibold ml-3">
                      {getTeamShort(fixture.team_a)}
                    </p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AppFixtures;

function SkeletonFixtures() {
  return (
    <Card className="w-11/12 md:w-5/12 mb-2">
      <CardHeader>
        <Skeleton className="h-8 w-5/12" />
        <Skeleton className="h-4 w-3/12" />
      </CardHeader>
      <CardContent className="space-y-2">
        {Array.from({ length: 10 }, (_, index) => index).map((_, index) => (
          <div
            className="flex justify-center items-center space-x-2"
            key={index}
          >
            <div className="flex justify-end items-center">
              <Skeleton className="h-4 w-10 mr-3" />
              <Skeleton className="h-8 w-8" />
            </div>
            <div className="flex justify-start items-center">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-4 w-10 ml-3" />
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
