"use client";
import { getLeagueData } from "@/services";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Separator } from "../ui/separator";
import AppTopStandings from "./AppTopStanding";
import { useEffect, useState } from "react";
import PositionChanges from "@/components/main/PositionChange";
import { Trophy, ChevronLeft, CircleX, ChevronsUp, ChevronsDown } from "lucide-react";

const AppStandings = (props: any) => {
  const { leagueId, showPromotionZone, showRelegationZone } = props;

  const [league, setLeague] = useState<any>(null);

  useEffect(() => {
    if (!league) {
      getLeague(leagueId).then((data) => {

        setLeague(data);
      });
    }
  });

  if (league && league.error) {
    return <ErrorFetch />;
  }

  return (
    <div className="pt-24 flex justify-center">
      <Card className="w-11/12 md:w-5/12">
        <CardHeader>
          <Button asChild variant={"outline"} className="mb-7">
            <Link href={`/`}>
              <ChevronLeft /> Back to Home
            </Link>
          </Button>

          <CardTitle>{league?.league?.name || ""}</CardTitle>
          <CardDescription>
            {(league?.league?.name || "") +
              ` ${league ? "Current Standing" : ""}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {league?.standings?.results.map((team: any, index: number) => (
            <div key={team.id} className={`w-full p-2 `}>
              {team.rank === 1 ? (
                <div className="pt-7 flex justify-center items-center flex-col space-y-5">
                  {/* <Trophy className="w-7 h-7" /> */}
                  <AppTopStandings entry={team} value={'total'}/>
                  <Separator />
                </div>
              ) : (
                <div>
                  <div className="pt-3 pb-6 flex justify-between items-center w-full">
                    <PositionChanges entry={team} />
                    <p className="text-xl font-semibold ml-3">{team.rank}</p>
                    <div className="w-full px-5">
                      <p className="text-xs font-semibold">{team.entry_name}</p>
                      <p className="text-xs">{team.player_name}</p>
                    </div>
                    <p className="text-xl font-semibold">{team.total}</p>
                  </div>
                  <CustomSeparator index={index} showPromotionZone={showPromotionZone} showRelegationZone={showRelegationZone}/>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppStandings;

async function getLeague(leagueId: string) {
  let hasNextPage = true;
  let page = 1;
  let league = null;

  while (hasNextPage) {
    const nextPageData = await getLeagueData(leagueId, page);


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
  }
  return league;
}

const ErrorFetch = () => {
  return (
    <div className="pt-24 flex justify-center">
      <Card className="w-11/12 md:w-5/12">
        <CardHeader>
          <Button asChild variant={"outline"} className="mb-7">
            <Link href={`/`}>
              <ChevronLeft /> Back to Home
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col justify-center items-center space-y-5 w-11/12">
            <div className="w-10 h-10 bg-slate-200 flex justify-center items-center rounded-lg">
              <CircleX />
            </div>
            <p className="text-xs">Failed to fetch data</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const CustomSeparator = (props: any) => {
  const { showPromotionZone, showRelegationZone, index } = props;
  if (showPromotionZone && index == 6) {
    return (
      <div className="w-full flex justify-center items-center h-4">
        <Separator className={`w-2/12 md:w-3/12 lg:w-4/12 border-green-600 border-2`} />
        <Badge
          className="border-green-600 border-2 text-green-600 flex justify-center"
          variant={"outline"}
        >
          <ChevronsUp className="w-4 h-4"/>
          Promotion Zone
          <ChevronsUp className="w-4 h-4"/>
        </Badge>
        <Separator className={`w-2/12 md:w-4/12 lg:w-4/12 border-green-600 border-2`} />
      </div>
    );
  }

  if (showRelegationZone && index == 25 - 1) {
    return (
      <div className="w-full flex justify-center items-center h-4">
        <Separator className={`w-2/12 md:w-3/12 lg:w-4/12 border-red-600 border-2`} />
        <Badge
          className="border-red-600 border-2 text-red-600 flex justify-center"
          variant={"outline"}
        >
          <ChevronsDown className="w-4 h-4"/>
          Relegation Zone
          <ChevronsDown className="w-4 h-4"/>
        </Badge>
        <Separator className={`w-2/12 md:w-3/12 lg:w-4/12 border-red-600 border-2`} />
      </div>
    );
  }

  return <Separator className="w-full" />;
};
