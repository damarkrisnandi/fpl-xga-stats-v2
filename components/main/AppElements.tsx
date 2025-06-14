"use client";

import {
  getArchivedBootstrap,
  getBootstrapFromStorage,
  getFixtures,
} from "@/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { createElement, useEffect, useState } from "react";
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
import {
  CirclePercent,
  Euro,
  PoundSterling,
  RefreshCw,
  TriangleAlert,
  Check
} from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import {
  difficultyColor,
  getExpectedPoints,
  getPlayerPhotoUrl,
  getTeamLogoUrl,
  positionMapping,
  previousSeason,
  xPColor,
} from "@/utils";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import AppNextFixtures from "./AppNextFixtures";
import AppExpectedPts from "./AppExpectedPts";
import {
  QueryClient,
  QueryClientProvider,
  useQueries,
  useQuery,
} from "@tanstack/react-query";
import useBootstrap from "@/hooks/use-bootstrap";
import useBootstrapHist from "@/hooks/use-bootstraphist";
import useFixtures from "@/hooks/use-fixtures";
import useCurrentEvent from "@/hooks/use-currentevent";
import useNextEvent from "@/hooks/use-nextevent";
import useLastFiveGw from "@/hooks/use-lastfivegw";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"



const AppElements = (props: any) => {
  const queryClient = new QueryClient();
  const { bootstrap, isLoadingBootstrap, errorBootstrap } = useBootstrap();
  const { bootstrapHist, isLoadingBootstrapHist, errorBootstrapHist } = useBootstrapHist({ season: previousSeason })
  const { fixtures, isLoadingFixtures, errorFixtures } = useFixtures();

  const { currentEvent } = useCurrentEvent({ bootstrap })  
  const { nextEvent } = useNextEvent({ bootstrap });

  const { last5, isLoadingLast5, errorLast5} = useLastFiveGw({ bootstrap, event: currentEvent, n: 5 });
  // const [fixtures, setFixtures] = useState<any>([]);
  const [filterByTeam, setFilterByTeam] = useState<number | null>(null);
  const [filterByPosition, setFilterByPosition] = useState<number | null>(null);

  const [columns, setColumns] = useState<any[]>([])

  useEffect(() => {
    if (columns.length == 0 && fixtures && fixtures.length > 0 && last5 && last5.length > 0) {
      setColumns(
        [
          {
            header: 'Name',
            field: 'web_name',
            class_td: '',
            isTransform: false,
            transform: (el: any) => el.web_name,
            type: 'name',
            isRender: true,
          },
          {
            header: '%',
            field: 'selected_by_percent',
            class_td: '',
            isTransform: true,
            transform: (el: any) => el.selected_by_percent + '%',
            isRender: false,
            render: (el: any) => null
          },
          {
            header: 'Next',
            field: '',
            class_td: '',
            isTransform: false,
            transform: (el: any) => el.id,
            isRender: true,
            type: 'nextFixtures'
          },
          {
            header: 'xP' + ((currentEvent?.id || 0) + 1),
            field: '',
            class_td: '',
            isTransform: true,
            transform: (el: any) => getExpectedPoints(
              el,
              (currentEvent?.id || 0),
              1,
              fixtures,
              bootstrap?.teams,
              bootstrapHist?.elements?.find((elh: any) => elh.code == el.code),
              last5
            ).toFixed(2),
            isRender: false,
            render: (el: any) => null
          },
          {
            header: 'xP' + ((currentEvent?.id || 0) + 2),
            field: '',
            class_td: '',
            isTransform: true,
            transform: (el: any) => getExpectedPoints(
              el,
              (currentEvent?.id || 0),
              2,
              fixtures,
              bootstrap?.teams,
              bootstrapHist?.elements?.find((elh: any) => elh.code == el.code),
              last5
            ).toFixed(2),
            isRender: false,
            render: (el: any) => null
          },
          {
            header: 'xP' + ((currentEvent?.id || 0) + 3),
            field: '',
            class_td: '',
            isTransform: true,
            transform: (el: any) => getExpectedPoints(
              el,
              (currentEvent?.id || 0),
              3,
              fixtures,
              bootstrap?.teams,
              bootstrapHist?.elements?.find((elh: any) => elh.code == el.code),
              last5
            ).toFixed(2),
            isRender: false,
            render: (el: any) => null
          },
          {
            header: 'Action',
            field: '',
            class_td: '',
            isTransform: false,
            transform: (el: any) => el.web_name,
            type: 'action',
            isRender: true,
          },
        ]
      )
    }
  }, [bootstrap, bootstrapHist, currentEvent, fixtures, last5])

  
  if (isLoadingBootstrap || isLoadingBootstrapHist || isLoadingFixtures || isLoadingLast5) {
    return (
      <Card className="w-11/12 md:w-10/12 lg:w-7/12">
        <CardHeader>
          <Skeleton className="h-8 w-5/12" />
          <Skeleton className="h-4 w-3/12" />
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    );
  }

  if (errorBootstrap || errorBootstrapHist || errorFixtures || errorLast5) {
    return <AppFailedToFetch />;
  }
  return (
    <Card className="w-full mb-2">
      <CardHeader>
        <CardTitle className="text-lg">Player Stats &amp; xPoints</CardTitle>
        <CardDescription>Statistics Results and Expectations</CardDescription>
      </CardHeader>
      <CardContent>
        <SelectTeam
          teams={bootstrap?.teams}
          onValueChangeTeam={(value: any) => {
            setFilterByTeam(value ? Number(value) : null);
          }}
          className="mb-2"
        />
        <SelectPosition
          onValueChangePosition={(value: any) => {
            setFilterByPosition(value ? Number(value) : null);
          }}
          className="mb-2"
        />
        <ScrollArea className="h-[600px] w-full rounded-md border p-4">
        <Table>
        <TableHeader>
          <TableRow>
            {
              columns.map((col: any) => (
                <TableHead key={col.header} className="">{col.header}</TableHead>
              ))
            }
          </TableRow>
        </TableHeader>
        <TableBody>
        {bootstrap.elements
            .toSorted(
              (a: any, b: any) =>
                b.total_points -
                a.total_points,
            )
            .filter((el: any) => filterByTeam ? el.team == filterByTeam : el)
            .filter((el: any) =>
              filterByPosition ? el.element_type == filterByPosition : el
            )
            .map((el: any) => (
            <TableRow key={el.id}>
              {
              columns.map((col: any) => {
                return (
                <TableCell key={col.header} className={col.class_td}>
                  {
                    col.isRender ? <ColsRenderer {...col} el={el} teams={bootstrap.teams} fixtures={fixtures} currentEvent={currentEvent}/> : col.transform(el) 
                  }
                </TableCell>
              )}
              )
              }
              {/* <TableCell className="font-medium">
                <div className="flex gap-2 items-center">
                  <div className="relative w-6 h-6 md:w-8 md:h-8">
                    <Image
                      src={getTeamLogoUrl(el.team_code)}
                      fill={true}
                      className="w-6 h-6 md:w-8 md:h-8"
                      sizes="20"
                      alt={`t${el.team_code}`}
                    />`

                  </div>
                {el.web_name}
                </div>
              </TableCell>
              <TableCell>{el.event_points}</TableCell>
              <TableCell>{el.total_points}</TableCell>
              <TableCell className="text-right">{el.selected_by_percent}</TableCell> */}
            </TableRow>
            ))}
          
        </TableBody>
        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>

        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AppElements;

const ColsRenderer = (props: any) => {
  switch (props.type) {
    case 'name':
      return (
      <div className="flex gap-2 items-center">
        <div className="relative w-6 h-6 md:w-8 md:h-8">
          <Image
            src={getTeamLogoUrl(props.el.team_code)}
            fill={true}
            className="w-6 h-6 md:w-8 md:h-8"
            sizes="20"
            alt={`t${props.el.team_code}`}
          />`
        </div>
        {props.el.web_name}
        <div>
          {
            props.el.status == 'a' ? <Check className="w-4 h-4" /> : <TriangleAlert className="w-4 h-4 text-orange-500" />
          }
        </div>
      </div>
      );
    case 'nextFixtures':
      const getTeamShort = (code: number) => {
        return props.teams.find((team: any) => team.id === code)?.short_name || "";
      };
    
      const nextFixtures = () =>
        props.fixtures.filter((fix: any) =>
          fix.event == props.currentEvent.id + 1 &&
          (fix.team_h == props.el.team || fix.team_a == props.el.team)
        );
      return <AppNextFixtures
        teams={props.teams}
        element={props.el}
        nextFixtures={nextFixtures()}
        isSimplify={true}
      />
    case 'xP':
      return <></>
    case 'action':
      return <Button asChild variant={"outline"}>
      <Link href={`player/${props.el.id}`} className="font-semibold">
        Show Player Details
      </Link>
    </Button>

    default:
      break;
  }
}

const SelectTeam = (props: any) => {
  const handleOnSelect = (value: any) => {
    props.onValueChangeTeam(value);
  };
  return (
    <Select onValueChange={handleOnSelect}>
      <SelectTrigger className={`w-full ${props.className}`}>
        <SelectValue placeholder="Filter Players by Team" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Teams</SelectLabel>
          <SelectItem value={"0"} key={0}>All</SelectItem>
          {props.teams.map((team: any) => (
            <SelectItem value={`${team.id}`} key={team.id}>
              {team.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
const SelectPosition = (props: any) => {
  const handleOnSelect = (value: any) => {
    props.onValueChangePosition(value);
  };
  return (
    <Select onValueChange={handleOnSelect}>
      <SelectTrigger className={`w-full ${props.className}`}>
        <SelectValue placeholder="Filter Players by Position" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Position</SelectLabel>
          <SelectItem value={"0"} key={0}>All</SelectItem>
          <SelectItem value={`1`}>GKP</SelectItem>
          <SelectItem value={`2`}>DEF</SelectItem>
          <SelectItem value={`3`}>MID</SelectItem>
          <SelectItem value={`4`}>FWD</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const PlayerCardStats = (props: any) => {
  const { className, element, currentEvent, fixtures, teams, elementHist, last5 } =
    props;

  const getTeamShort = (code: number) => {
    return teams.find((team: any) => team.id === code)?.short_name || "";
  };

  const nextFixtures = () =>
    fixtures.filter((fix: any) =>
      fix.event == currentEvent.id + 1 &&
      (fix.team_h == element.team || fix.team_a == element.team)
    );
  // const mappingFixtures = nextFixtures.map((nextf: any) => element.team == nextf.team_h ? `${getTeamShort(nextf.team_a)} (H)` : `${getTeamShort(nextf.team_h)} (A)`).join('\n')
  return (
    <div className={`w-full ${className}`}>
      <div className="w-full p-2">
        <div className="flex justify-stretch w-full items-center mb-1">
          <div className="flex items-center">
            {
              /* <Avatar>
              <AvatarImage
                src={getPlayerPhotoUrl(element.photo)}
                alt={element.web_name}
              />
            </Avatar> */
            }
            <div className="relative w-8 h-8 md:w-20 md:h-20">
              <Image
                src={getTeamLogoUrl(element.team_code)}
                fill={true}
                className="w-8 h-8 md:w-20 md:h-20"
                sizes="20"
                alt={`t${element.team_code}`}
              />
            </div>

            <div className="p-2">
              <p className="text-sm md:text-xl font-semibold">
                {element.web_name} | {positionMapping(element.element_type)}
              </p>
              <p className="text-xs md:text-md text-gray-500">
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
          {showExpected("xG", element.element_type) && (
            <div className="w-full flex justify-center">
              <StatItem label={`xG`} value={element.expected_goals} />
              <StatItem label={`xG90`} value={element.expected_goals_per_90} />
              <StatItem label={"Goals"} value={element.goals_scored} />
              <StatItem
                label={"G-xG"}
                value={(element.goals_scored - element.expected_goals).toFixed(
                  2,
                )}
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
            </div>
          )}
          {showExpected("xA", element.element_type) && (
            <div className="w-full flex justify-center">
              <StatItem label={`xA`} value={element.expected_assists} />
              <StatItem
                label={`xA90`}
                value={element.expected_assists_per_90}
              />
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
            </div>
          )}
          {showExpected("xGC", element.element_type) && (
            <div className="w-full flex justify-center">
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
            </div>
          )}
          {showExpected("CS", element.element_type) && (
            <div className="w-full flex justify-center">
              <StatItem label={`CS`} value={element.clean_sheets} />
              <StatItem label={`CS90`} value={element.clean_sheets_per_90} />
            </div>
          )}
          {currentEvent?.id > 1 && (
            <div className="w-full flex justify-center">
              <StatItem
                label={`GW${currentEvent?.id}`}
                value={element.event_points}
              />
              <AppExpectedPts
                element={element}
                elementHist={elementHist}
                currentEvent={currentEvent}
                deltaEvent={0}
                fixtures={fixtures}
                teams={teams}
                multiplier={1}
                last5={last5}
              />

              <StatItem label={" "} value={" "} />
              <StatItem
                label={`P${currentEvent?.id}-xP${currentEvent?.id}`}
                value={(element.event_points -
                  getExpectedPoints(
                    element,
                    currentEvent?.id,
                    0,
                    fixtures,
                    teams,
                    elementHist,
                    last5
                  )).toFixed(2)}
                className={`
            ${
                  (element.event_points -
                      getExpectedPoints(
                        element,
                        currentEvent?.id,
                        0,
                        fixtures,
                        teams,
                        elementHist,
                        last5
                      )) > 0
                    ? "bg-green-200 text-green-700"
                    : ""
                }
            ${
                  element.event_points == 0 ||
                    (element.event_points -
                        getExpectedPoints(
                          element,
                          currentEvent.id,
                          0,
                          fixtures,
                          teams,
                          elementHist,
                          last5
                        )) < 0
                    ? "bg-red-200 text-red-700"
                    : ""
                }
            `}
              />
            </div>
          )}
          {currentEvent?.id < 38 && (
            <div className="w-full flex justify-center">
              <AppNextFixtures
                teams={teams}
                element={element}
                nextFixtures={nextFixtures()}
              />
              <AppExpectedPts
                element={element}
                elementHist={elementHist}
                currentEvent={currentEvent}
                deltaEvent={1}
                fixtures={fixtures}
                teams={teams}
                multiplier={1}
                last5={last5}
              />
              <AppExpectedPts
                element={element}
                elementHist={elementHist}
                currentEvent={currentEvent}
                deltaEvent={2}
                fixtures={fixtures}
                teams={teams}
                multiplier={1}
                last5={last5}
              />
              <AppExpectedPts
                element={element}
                elementHist={elementHist}
                currentEvent={currentEvent}
                deltaEvent={3}
                fixtures={fixtures}
                teams={teams}
                multiplier={1}
                last5={last5}
              />
            </div>
          )}
        </div>
        <Button asChild variant={"outline"} className="w-full">
          <Link href={`player/${element.id}`} className="font-semibold">
            Show Player Details
          </Link>
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
      <p className="text-[0.6em] md:text-sm">{label}</p>
      <p className="text-sm md:text-xl font-semibold">{value}</p>
    </div>
  );
};

const NewsContainer = (props: any) => {
  const { news } = props;
  return (
    <div
      className={`w-56 h-14 md:w-96 md:h-20 py-1 px-3 md:py-3 md:px-5 flex justify-center items-center bg-yellow-200 space-x-2`}
    >
      <TriangleAlert className="w-6 h-6" />
      <p className="text-xs md:text-sm">{news}</p>
    </div>
  );
};

function showExpected(props: string, position: number) {
  const allowance: any = {
    "xG": [],
    "xA": [],
    "xGC": [],
    "xP": [1, 2, 3, 4],
    "CS": [],
  };
  return allowance[props]?.includes(position);
}
