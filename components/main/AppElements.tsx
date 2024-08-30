"use client";

import { getBootstrapFromStorage, getFixtures } from "@/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useEffect, useState } from "react";
import AppFailedToFetch from "./AppFailedToFetch";
import { Skeleton } from "../ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
import PlayerCard from "../PlayerCard";
import { CirclePercent, Euro, PoundSterling, RefreshCw, TriangleAlert } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { difficultyColor, getExpectedPoints, getPlayerPhotoUrl, getTeamLogoUrl, positionMapping } from "@/utils";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const AppElements = (props: any) => {
  const [bootstrap, setBootstrap] = useState<any>(null);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [nextEvent, setNextEvent] = useState<any>(null);
  const [fixtures, setFixtures] = useState<any>([]);
  const [filterByTeam, setFilterByTeam] = useState<number | null>(null);

  useEffect(() => {
    if (!bootstrap) {
      getBootstrapFromStorage().then((data) => {
        setBootstrap(data);

        setCurrentEvent(
          data.events
            .filter(
              (event: any) =>
                new Date(event.deadline_time).getTime() <= new Date().getTime()
            )
            .at(-1)
        );

        setNextEvent(
          data.events.filter(
            (event: any) =>
              new Date(event.deadline_time).getTime() > new Date().getTime()
          )[0]
        );
      });
    }

    if (bootstrap && fixtures.length == 0) {
      getFixtures().then((data) => setFixtures(data));
    }
  });

  if (!bootstrap) {
    return (
      <Card className="w-11/12 md:w-5/12">
        <CardHeader>
          <Skeleton className="h-8 w-5/12" />
          <Skeleton className="h-4 w-3/12" />
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    );
  }

  if (bootstrap && bootstrap.error) {
    return <AppFailedToFetch />;
  }
  return (
    <Card className="w-11/12 md:w-5/12">
      <CardHeader>
        <CardTitle className="text-lg">Player Stats &amp; xPoints</CardTitle>
        <CardDescription>Statistics Results and Expectations</CardDescription>
      </CardHeader>
      <CardContent>
        <SelectTeam teams={bootstrap?.teams}  onValueChangeTeam={(value: any) => { setFilterByTeam(value ? Number(value) : null)}} className="mb-2" />
        <ScrollArea className="h-[600px] w-full rounded-md border p-4">
          {bootstrap.elements
            .toSorted(
              (a: any, b: any) =>
                b.total_points -
                a.total_points
            )
            .filter((el: any) => filterByTeam ? el.team == filterByTeam : el)
            .map((el: any) => (
              <div
                key={el.id}
                className="flex flex-col items-center justify-center space-y-2"
              >
                <PlayerCardStats element={el} currentEvent={currentEvent} fixtures={fixtures} teams={bootstrap?.teams}/>
              </div>
            ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AppElements;

const SelectTeam = (props: any) => {
    const handleOnSelect = (value: any) => {
        console.log(value)
        props.onValueChangeTeam(value)
    }
  return (
    <Select onValueChange={handleOnSelect}>
      <SelectTrigger className={`w-full ${props.className}`}>
        <SelectValue placeholder="Filter Players by Team" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Teams</SelectLabel>
          <SelectItem value={'0'} key={0} >All</SelectItem>
          {props.teams.map((team: any) => (
            <SelectItem value={`${team.id}`} key={team.id} >
              {team.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const PlayerCardStats = (props: any) => {
  const { className, element, currentEvent, fixtures, teams } = props;

  const getTeamShort = (code: number) => {
    return teams.find((team: any) => team.id === code)?.short_name || "";
  };

  const nextFixtures = fixtures.filter((fix: any) => fix.event == currentEvent.id + 1 && (fix.team_h == element.team || fix.team_a == element.team) );
  const mappingFixtures = nextFixtures.map((nextf: any) => element.team == nextf.team_h ? `${getTeamShort(nextf.team_a)} (H)` : `${getTeamShort(nextf.team_h)} (A)`).join('\n')
  return (
    <div className={`w-full ${className}`}>
      <div className="w-full p-2">
        <div className="flex justify-stretch w-full items-center">
          <div className="flex items-center">
            <Avatar>
              <AvatarImage
                src={getPlayerPhotoUrl(element.photo)}
                alt={element.web_name}
              />
              {/* <AvatarFallback>CN</AvatarFallback> */}
            </Avatar>
            <Image
              src={getTeamLogoUrl(element.team_code)}
              height={32}
              width={32}
              alt={`t${element.team_code}`}
            />

            <div className="p-2">
              <p className="text-sm font-semibold">{element.web_name} | {positionMapping(element.element_type)}</p>
              <p className="text-xs text-gray-500">
                {element.first_name} {element.second_name}
              </p>
              
            </div>
            
          </div>
        </div>
        <div className="flex justify-center flex-col mb-2">
          {element.news && element.news.length && (
      <div className="w-full flex justify-center">
        <NewsContainer news={element.news} />
      </div>
          )}
          <div className="w-full flex justify-center">
            <StatItem
              label={`Total`}
              value={element.total_points}
            />
            <StatItem
              label={"COST"}
              value={`${(element.now_cost / 10).toFixed(1)}`}
            />
            <StatItem
              label={"%TSB"}
              value={`${element.selected_by_percent}%`}
            />
            <StatItem label={"Mins"} value={element.minutes} />
          </div>
          {showExpected('xG', element.element_type) && (<div className="w-full flex justify-center">
            <StatItem label={`xG`} value={element.expected_goals} />
            <StatItem label={`xG90`} value={element.expected_goals_per_90} />
            <StatItem label={"Goals"} value={element.goals_scored} />
            <StatItem
              label={"G-xG"}
              value={(element.goals_scored - element.expected_goals).toFixed(2)}
              className={`
            ${
              element.goals_scored - element.expected_goals > 0
                ? "bg-green-200 text-green-700"
                : ""
            }
            ${
              element.goals_scored - element.expected_goals < 0
                ? "bg-red-200 text-red-700"
                : ""
            }

            `}
            />
          </div>)}
          {showExpected('xA', element.element_type) && (<div className="w-full flex justify-center">
            <StatItem label={`xA`} value={element.expected_assists} />
            <StatItem label={`xA90`} value={element.expected_assists_per_90} />
            <StatItem label={"Assists"} value={element.assists} />
            <StatItem
              label={"A-xA"}
              value={(element.assists - element.expected_assists).toFixed(2)}
              className={`
            ${
              element.assists - element.expected_assists > 0
                ? "bg-green-200 text-green-700"
                : ""
            }
            ${
              element.assists - element.expected_assists < 0
                ? "bg-red-200 text-red-700"
                : ""
            }
            `}
            />
          </div>)}
          {showExpected('xGC', element.element_type) && (<div className="w-full flex justify-center">
            <StatItem label={`xGC`} value={element.expected_goals_conceded} />
            <StatItem
              label={`xGC90`}
              value={element.expected_goals_conceded_per_90}
            />
            <StatItem label={"GC"} value={element.goals_conceded} />
            <StatItem
              label={"xGC-GC"}
              value={(
                element.expected_goals_conceded - element.goals_conceded
              ).toFixed(2)}
              className={`
            ${
              element.expected_goals_conceded - element.goals_conceded > 0
                ? "bg-green-200 text-green-700"
                : ""
            }
            ${
              element.expected_goals_conceded - element.goals_conceded < 0
                ? "bg-red-200 text-red-700"
                : ""
            }
            `}
            />
          </div>)}
          {showExpected('CS', element.element_type) && (<div className="w-full flex justify-center">
            <StatItem label={`CS`} value={element.clean_sheets} />
            <StatItem label={`CS90`} value={element.clean_sheets_per_90} />
            
          </div>)}
          <div className="w-full flex justify-center">
            {/* <NextFixturesItem teams={teams} element={element} nextFixtures={nextFixtures} /> */}
            {/* <StatItem label={`xP${currentEvent.id + 1}`} value={getExpectedPoints(element, currentEvent.id, 0, fixtures).toFixed(2)} /> */}
            <StatItem label={`GW${currentEvent.id}`} value={element.event_points} /> 
            <StatItem label={`xP${currentEvent.id}`} value={getExpectedPoints(element, currentEvent.id, -1, fixtures).toFixed(2)} />
            <StatItem label={' '} value={' '} />
            <StatItem label={`P${currentEvent.id}-xP${currentEvent.id}`} 
            value={(element.event_points - getExpectedPoints(element, currentEvent.id, -1, fixtures)).toFixed(2)} 
            className={`
            ${
              (element.event_points - getExpectedPoints(element, currentEvent.id, -1, fixtures)) > 0
                ? "bg-green-200 text-green-700"
                : ""
            }
            ${
              element.event_points == 0 || (element.event_points - getExpectedPoints(element, currentEvent.id, -1, fixtures)) < 0
                ? "bg-red-200 text-red-700"
                : ""
            }
            `}
            />
          </div>
          <div className="w-full flex justify-center">
            <NextFixturesItem teams={teams} element={element} nextFixtures={nextFixtures} />
            <StatItem label={`xP${currentEvent.id + 1}`} value={getExpectedPoints(element, currentEvent.id, 0, fixtures).toFixed(2)} />
            <StatItem label={' '} value={' '} />
            <StatItem label={' '} value={' '} />
 
          </div>
        </div>
        <Button asChild variant={"outline"} className="w-full">
          <Link href={`player/${element.id}`} className="font-semibold">Show Player Details</Link>
        </Button>
      </div>
      <Separator className="w-full" />
    </div>
  );
};

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
const NextFixturesItem = (props: any) => {
  const { className, teams, element, nextFixtures } = props;
  const getTeamShort = (code: number) => {
    return teams.find((team: any) => team.id === code)?.short_name || "";
  };

  return (
    <div
      className={`w-14 h-14 md:w-24 md:h-24 flex flex-col justify-center items-center ${
        className || ""
      } bg-slate-200`}
    >
      <p className="text-xs md:text-sm">Next</p>
      <div>
        {
        nextFixtures
        .map((nextf: any, index: number) => (
            <div className={`text-xs md:text-lg font-semibold ${difficultyColor(element.team == nextf.team_h ? nextf.team_h_difficulty : nextf.team_a_difficulty)}`} key={nextf.id}>{element.team == nextf.team_h ? `${getTeamShort(nextf.team_a)} (H)` : `${getTeamShort(nextf.team_h)} (A)`}</div> 
        ))
        }
      </div>
    </div>
  );
};

const NewsContainer = (props: any) => {
  const { news } = props;
  return (
    <div
      className={`w-56 h-14 md:w-96 md:h-20 py-1 px-3 md:py-3 md:px-5 flex justify-center items-center bg-yellow-200 space-x-1`}
    >
      <TriangleAlert className="w-5 h-5 font-semibold"/>
      <p className="text-xs md:text-sm">{news}</p>
    </div>
  )
}

function showExpected(props: string, position: number) {
    const allowance: any = {
        "xG": [2, 3, 4],
        "xA": [2, 3, 4],
        "xGC": [1, 2],
        "xP": [1, 2, 3, 4],
        "CS": [],
    }
    return allowance[props]?.includes(position)
}
