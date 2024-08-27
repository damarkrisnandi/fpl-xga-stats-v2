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
import { CirclePercent } from "lucide-react";

const AppElements = (props: any) => {
  const [bootstrap, setBootstrap] = useState<any>(null);

  useEffect(() => {
    if (!bootstrap) {
      getBootstrapFromStorage().then((bootstrap) => setBootstrap(bootstrap));
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
        <SelectTeam teams={bootstrap?.teams} />
        <ScrollArea className="h-[600px] w-full rounded-md border p-4">
          {bootstrap.elements.map((el: any) => (
            <div
              key={el.id}
              className="flex flex-col items-center justify-center space-y-2"
            >
              <PlayerCardStats element={el} />
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
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Filter Players by Team" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Teams</SelectLabel>
          {props.teams.map((team: any) => (
            <SelectItem value={team.name}>{team.name}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const PlayerCardStats = (props: any) => {
  const { element } = props;

  return (
    <Card className="w-full mb-1 p-0">
      <CardHeader className="">
        <CardTitle className="text-md">{element.web_name}</CardTitle>
        <CardDescription className="text-xs">
          {element.first_name} {element.second_name}
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <div className="flex space-x-2 items-center text-xs">
            <CirclePercent/>
            <p>{element.selected_by_percent}%</p>
        </div>
      </CardContent>
    </Card>
  );
};
