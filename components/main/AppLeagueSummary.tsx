"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getArchivedLeague, getLeagueData, getManagerData } from "@/services";
import {
  CircleX,
  Component,
  Construction,
  Loader2,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Skeleton } from "../ui/skeleton";
import AppTopStandings from "./AppTopStanding";
import AppFailedToFetch from "./AppFailedToFetch";

const AppLeagueSummary = (props: any) => {
  const {
    season,
    leagueAlias,
    leagueId,
    leagueTitle,
    motwExist,
    events,
    phases,
  } = props;
  const [league, setLeague] = useState<any>(null);
  const [leagueByPhase, setLeagueByPhase] = useState<any>(null);

  const [phase, setPhase] = useState<any>(null);
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    if (!league) {
      getLeague(leagueId).then((value) => setLeague(value));
    }

    if (!leagueByPhase) {
      const currentEvent = events.filter((event: any) =>
        new Date(event.deadline_time).getTime() <= new Date().getTime()
      ).at(-1);

      const currentPhase = phases
        .filter((phase: any) => phase.id > 1)
        .find(
          (phase: any) =>
            phase.start_event <= currentEvent.id &&
            phase.stop_event >= currentEvent.id,
        );

      getLeague(leagueId, currentPhase.id).then((value) => {
        setEvent(currentEvent);
        setPhase(currentPhase);
        setLeagueByPhase(value);
      });
    }
  });

  if (!league) {
    return <SkeletonSummary />;
  }

  if (league && league.error) {
    return <AppFailedToFetch />;
  }

  return (
    <Card className="w-11/12 md:w-5/12 mb-2">
      <CardHeader>
        <CardTitle>
          <span className="flex items-center space-x-10">
            {leagueTitle}
            <Trophy className="w-5 h-5 ml-2" />
          </span>
          <p className="text-sm font-light">{leagueAlias}</p>
        </CardTitle>
        <CardDescription>
          {league?.standings?.results?.length || 0} teams
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <Tabs defaultValue={motwExist ? "motw" : "motm"} className="w-full">
          <TabsList className="w-full">
            {motwExist && (
              <TabsTrigger value={"motw"} className="w-full">
                MOTW
              </TabsTrigger>
            )}
            <TabsTrigger value={"motm"} className="w-full">
              MOTM
            </TabsTrigger>
            <TabsTrigger value={"standings"} className="w-full">
              Standings #1
            </TabsTrigger>
          </TabsList>
          <TabsContent value="motw" className="py-7">
            {league?.standings?.results
              ?.filter(
                (result: any) =>
                  result.event_total ==
                    Math.max(
                      ...league?.standings?.results?.map(
                        (r: any) => r.event_total,
                      ),
                      0,
                    ),
              )
              .map((team: any) => (
                <div className="w-full" key={team.entry}>
                  <AppTopStandings entry={team} value={"event_total"} />
                  <TotalTransfer entry={team} />
                </div>
              ))}
          </TabsContent>
          <TabsContent value="motm" className="py-7">
            {event?.id < phase?.stop_event
              ? <PhaseNotOverYet phase={phase} event={event} />
              : (
                <div>
                  {leagueByPhase?.standings?.results
                    ?.filter((result: any) => result.rank === 1)
                    .map((team: any) => (
                      <AppTopStandings
                        key={team.entry}
                        entry={team}
                        value={"total"}
                      />
                    ))}
                </div>
              )}
          </TabsContent>
          <TabsContent value="standings" className="py-7">
            {league?.standings?.results
              ?.filter((result: any) => result.rank === 1)
              .map((team: any) => (
                <AppTopStandings
                  key={team.entry}
                  entry={team}
                  value={"total"}
                />
              ))}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button asChild variant={"outline"} className="w-full">
          <Link href={`league/${leagueId}`} className="font-semibold">
            League Standings
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AppLeagueSummary;

async function getLeague(leagueId: string, phase?: number) {
  let hasNextPage = true;
  let page = 1;
  let league = null;

  while (hasNextPage) {
    const nextPageData = await getLeagueData(leagueId, page, phase);
    if (nextPageData && nextPageData.error) {
      hasNextPage = false;
      league = nextPageData;
      break;
    }
    if (!league) {
      league = nextPageData;
    } else {
      league.standings.results.push(...nextPageData.standings.results);
      league.standings.has_next = nextPageData.standings.has_next;
    }
    page++;
    hasNextPage = league.standings.has_next;
    if (phase) {
      hasNextPage = false;
    }
  }
  return league;
}

const UnderConstruction = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-5 w-full">
      <div className="w-10 h-10 bg-slate-200 flex justify-center items-center rounded-lg">
        <Construction />
      </div>
      <p className="text-xs">under construction</p>
    </div>
  );
};

const PhaseNotOverYet = (props: any) => {
  const { phase, event } = props;
  return (
    <div className="flex flex-col justify-center items-center space-y-5 w-full">
      <div className="w-10 h-10 bg-green-200 flex justify-center items-center rounded-lg">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
      <p className="text-xs">
        {phase?.name} is not yet over (
        {phase?.stop_event - event?.id + 1}/
        {phase?.stop_event - phase?.start_event + 1} GW)
      </p>
    </div>
  );
};

function SkeletonSummary() {
  return (
    <Card className="w-11/12 md:w-5/12 mb-2">
      <CardHeader>
        <Skeleton className="h-8 w-5/12" />
        <Skeleton className="h-4 w-3/12" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex w-full space-x-1">
          <Skeleton className="h-4 w-4/12" />
          <Skeleton className="h-4 w-4/12" />
          <Skeleton className="h-4 w-4/12" />
        </div>
        <Skeleton className="h-12 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-12 w-full" />
      </CardFooter>
    </Card>
  );
}

async function TotalTransfer(props: any) {
  const { entry } = props;
  const managerData = await getManagerData(entry.entry);
  return (
    <p className="w-full text-xs text-right">
      ({managerData.last_deadline_total_transfers} transfers)
    </p>
  );
}
