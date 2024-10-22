"use client";
import { getArchivedLeague, getLeagueData } from "@/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { Separator } from "../ui/separator";
import AppTopStandings from "./AppTopStanding";
import { useEffect, useState } from "react";
import PositionChanges from "@/components/main/PositionChange";
import { ChevronLeft, Trophy } from "lucide-react";

const AppArchivedStandings = (props: any) => {
  const { season, leagueId } = props;

  const [league, setLeague] = useState<any>(null);

  useEffect(() => {
    if (!league) {
      getLeague(season, leagueId).then((data) => {
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
          <div className="w-full flex space-x-2">
            <Button asChild variant={"outline"} className="mb-7">
              <Link href={`/2023-2024`}>Back to Summary</Link>
            </Button>
            <Button asChild variant={"outline"} className="mb-7">
              <Link href={`/`}>
                <ChevronLeft /> Back to Home
              </Link>
            </Button>
          </div>

          <CardTitle>{league?.league?.name || ""}</CardTitle>
          <CardDescription>
            {(league?.league?.name || "") +
              ` ${league ? "Final Standing" : ""}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {league?.standings?.results.map((team: any) => (
            <div key={team.id} className={`w-full p-2 `}>
              {team.rank === 1
                ? (
                  <div className="pt-7 flex justify-center items-center flex-col space-y-5">
                    {/* <Trophy className="w-7 h-7" /> */}
                    <AppTopStandings entry={team} value={"total"} />
                    <Separator />
                  </div>
                )
                : (
                  <div>
                    <div className="pt-3 pb-6 flex justify-between items-center w-full">
                      <PositionChanges entry={team} />
                      <p className="text-xl font-semibold ml-3">{team.rank}</p>
                      <div className="w-full px-5">
                        <p className="text-xs font-semibold">
                          {team.entry_name}
                        </p>
                        <p className="text-xs">{team.player_name}</p>
                      </div>
                      <p className="text-xl font-semibold">{team.total}</p>
                    </div>
                    <Separator className="w-full" />
                  </div>
                )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppArchivedStandings;

async function getLeague(season: string, leagueId: string) {
  let hasNextPage = true;
  let page = 1;
  let league = null;

  while (hasNextPage) {
    const nextPageData = await getArchivedLeague(season, leagueId, page);

    if (!nextPageData || nextPageData.error) {
      return null;
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
          <p>Failed to fetch data</p>
        </CardContent>
      </Card>
    </div>
  );
};
