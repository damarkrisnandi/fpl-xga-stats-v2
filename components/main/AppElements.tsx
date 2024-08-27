"use client";

import { getBootstrapFromStorage } from "@/services";
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
import { CirclePercent, Euro, PoundSterling } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { getPlayerPhotoUrl, getTeamLogoUrl } from "@/utils";
import { Separator } from "../ui/separator";
import Image from "next/image";

const AppElements = (props: any) => {
  const [bootstrap, setBootstrap] = useState<any>(null);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [nextEvent, setNextEvent] = useState<any>(null);

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
      });
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
        <SelectTeam teams={bootstrap?.teams} className="mb-2" />
        <ScrollArea className="h-[600px] w-full rounded-md border p-4">
          {bootstrap.elements
            .toSorted(
              (a: any, b: any) =>
                parseFloat(b.selected_by_percent) -
                parseFloat(a.selected_by_percent)
            )
            .map((el: any) => (
              <div
                key={el.id}
                className="flex flex-col items-center justify-center space-y-2"
              >
                <PlayerCardStats element={el} currentEvent={currentEvent} />
              </div>
            ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AppElements;

const SelectTeam = (props: any) => {
  return (
    <Select>
      <SelectTrigger className={`w-full ${props.className}`}>
        <SelectValue placeholder="Filter Players by Team" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Teams</SelectLabel>
          {props.teams.map((team: any) => (
            <SelectItem value={team.name} key={team.id}>
              {team.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const PlayerCardStats = (props: any) => {
  const { className, element, currentEvent } = props;

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
              <p className="text-xl font-semibold">{element.web_name}</p>
              <p className="text-sm text-gray-500">
                {element.first_name} {element.second_name}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full flex">
          <StatItem
            label={`GW${currentEvent.id}`}
            value={element.event_points}
          />
          <StatItem label={"COST"} value={(element.now_cost / 10).toFixed(2)} />
          <StatItem label={"%TSB"} value={`${element.selected_by_percent}%`} />
        </div>
        <div className="w-full flex">
          <StatItem label={`xG`} value={element.expected_goals} />
          <StatItem label={`xG90`} value={element.expected_goals_per_90} />
          <StatItem label={"Goals"} value={element.goals_scored} />
          <StatItem
            label={"(xG-G)"}
            value={(element.goals_scored - element.expected_goals).toFixed(2)}
            className={`
            ${(element.goals_scored - element.expected_goals) > 0 ? 'bg-green-200 text-green-700' : ''}
            ${(element.goals_scored - element.expected_goals) < 0 ? 'bg-red-200 text-red-700' : ''}

            `}
          />
        </div>
        <div className="w-full flex">
          <StatItem label={`xA`} value={element.expected_assists} />
          <StatItem label={`xA90`} value={element.expected_assists_per_90} />
          <StatItem label={"Assists"} value={element.assists} />
          <StatItem
            label={"(xA-A)"}
            value={(element.assists - element.expected_assists).toFixed(2)}
            className={`
            ${(element.assists - element.expected_assists) > 0 ? 'bg-green-200 text-green-700' : ''}
            ${(element.assists - element.expected_assists) < 0 ? 'bg-red-200 text-red-700' : ''}
            `}
          />
        </div>
      </div>
      <Separator className="w-full" />
    </div>
  );
};

const StatItem = (props: any) => {
  const { className, label, value } = props;
  return (
    <div className={`w-14 h-14 p-2 bg-slate-200 flex flex-col justify-center items-center ${className || ''}`}>
      <p className="text-xs">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
};
