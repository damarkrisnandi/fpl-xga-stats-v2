"use client";
import {
  getArchivedBootstrap,
  getBootstrapFromStorage,
  getFixtures,
} from "@/services";
import {
  getExpectedPoints,
  getPlayerPhotoUrl,
  getTeamLogoUrl,
  positionMapping,
  previousSeason,
} from "@/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import AppSpinner from "./AppSpinner";
import AppFailedToFetch from "./AppFailedToFetch";
import AppExpectedPts from "./AppExpectedPts";
import { TriangleAlert } from "lucide-react";
import AppNextFixtures from "./AppNextFixtures";
import useBootstrap from "@/hooks/use-bootstrap";
import useBootstrapHist from "@/hooks/use-bootstraphist";
import useCurrentEvent from "@/hooks/use-currentevent";
import useNextEvent from "@/hooks/use-nextevent";
import useFixtures from "@/hooks/use-fixtures";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import withQueryClientProvider from "../react-query/MainProvider";
import useLastFiveGw from "@/hooks/use-lastfivegw";

const AppElementSummaryWithProvider = (props: any) => {
  return (<AppElementSummaryContent {...props}/>);
};

const AppElementSummary = withQueryClientProvider(AppElementSummaryWithProvider);

const AppElementSummaryContent = (props: any) => {

  const { elementId } = props;

  // const [bootstrap, setBootstrap] = useState<any>(null);
  const { bootstrap, isLoadingBootstrap, errorBootstrap } = useBootstrap();
  const { bootstrapHist, isLoadingBootstrapHist, errorBootstrapHist } = useBootstrapHist({ season: previousSeason });
  const { currentEvent, isLoadingCurrentEvent, errorCurrentEvent } = useCurrentEvent({ bootstrap });
  const { nextEvent } = useNextEvent({ bootstrap });
  const { fixtures, isLoadingFixtures, errorFixtures } = useFixtures(); 
  // const [bootstrapHist, setBootstrapHist] = useState<any>(null);
  const [elementSummary, setElementSummary] = useState<any>(null);
  // const [currentEvent, setCurrentEvent] = useState<any>(null);
  // const [nextEvent, setNextEvent] = useState<any>(null);
  // const [fixtures, setFixtures] = useState<any>([]);

  const { last5, isLoadingLast5, errorLast5} = useLastFiveGw({ bootstrap, event: currentEvent, n: 5 });

  const elementMapping = () =>
    bootstrap.elements.find((el: any) => el.id == elementId);
  
  
  const isLoading = isLoadingBootstrap || isLoadingBootstrapHist || isLoadingFixtures || isLoadingCurrentEvent || isLoadingLast5;
  const error = errorBootstrap || errorBootstrapHist || errorFixtures || errorCurrentEvent || errorLast5;

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <AppSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <AppFailedToFetch />
      </div>
    );
  }

  const getNextFixtures = () =>
    fixtures.filter((fix: any) =>
      fix.event == currentEvent.id + 1 &&
      (fix.team_h == elementMapping().team ||
        fix.team_a == elementMapping().team)
    );

  return (
    <div className="w-11/12 md:w-10/12 lg:w-7/12">
      <div className="flex flex-col items-center space-y-2">
        <div className="relative w-32 h-32 md:w-40 md:h-40">
          <Image
            src={getPlayerPhotoUrl(elementMapping().photo)}
            fill={true}
            className="w-32 h-32 md:w-64 md:h-64"
            sizes="20"
            alt={`${elementMapping().photo}`}
          />
        </div>
        <div
          className={`w-60 md:w-96  flex justify-start items-center bg-slate-200 space-x-2`}
        >
          <div className="w-full">
            <div className="py-2 px-3 md:py-3 md:px-5 w-full ">
              <p className="text-xs md:text-lg font-semibold">
                {elementMapping().web_name}
              </p>
              <p className="text-xs md:text-md">
                {positionMapping(elementMapping().element_type)}
              </p>
            </div>

            {elementMapping().news && elementMapping().news.length && (
              <div className="w-full flex justify-center">
                <NewsContainer news={elementMapping().news} />
              </div>
            )}

            <div className="flex">
              <StatItem label={`Total`} value={elementMapping().total_points} />
              <StatItem
                label={"COST"}
                value={`${(elementMapping().now_cost / 10).toFixed(1)}`}
              />
              <StatItem
                label={"%TSB"}
                value={`${elementMapping().selected_by_percent}%`}
              />
              <StatItem label={"Mins"} value={elementMapping().minutes} />
            </div>

            {currentEvent.id >= 1 && (
              <div className="flex">
                <StatItem
                  label={`GW${currentEvent.id}`}
                  value={elementMapping().event_points}
                />
                <AppExpectedPts
                  element={elementMapping()}
                  elementHist={bootstrapHist?.elements.find((elh: any) =>
                    elh.code == elementMapping().code
                  )}
                  currentEvent={currentEvent}
                  deltaEvent={-1}
                  fixtures={fixtures}
                  teams={bootstrap?.teams}
                  multiplier={1}
                  last5={last5}
                />

                <StatItem label={" "} value={" "} />
                <StatItem
                  label={`P${currentEvent.id}-xP${currentEvent.id}`}
                  value={(
                    elementMapping().event_points -
                    getExpectedPoints(
                      elementMapping(),
                      currentEvent.id,
                      0,
                      fixtures,
                      bootstrap?.teams,
                      bootstrapHist?.elements.find((elh: any) =>
                        elh.code == elementMapping().code
                      ),
                      last5
                    )
                  ).toFixed(2)}
                  className={`
            ${
                    elementMapping().event_points -
                          getExpectedPoints(
                            elementMapping(),
                            currentEvent.id,
                            0,
                            fixtures,
                            bootstrap?.teams,
                            bootstrapHist?.elements.find((elh: any) =>
                              elh.code == elementMapping().code
                            ),
                            last5
                          ) >
                        0
                      ? "bg-green-200 text-green-700"
                      : ""
                  }
            ${
                    elementMapping().event_points == 0 ||
                      elementMapping().event_points -
                            getExpectedPoints(
                              elementMapping(),
                              currentEvent.id,
                              0,
                              fixtures,
                              bootstrap?.teams,
                              bootstrapHist?.elements.find((elh: any) =>
                                elh.code == elementMapping().code
                              ),
                              last5
                            ) <
                        0
                      ? "bg-red-200 text-red-700"
                      : ""
                  }
            `}
                />
              </div>
            )}

            {currentEvent.id < 38 && (
              <div className="flex">
                <AppNextFixtures
                  teams={bootstrap?.teams}
                  element={elementMapping()}
                  nextFixtures={getNextFixtures()}
                />
                <AppExpectedPts
                  element={elementMapping()}
                  currentEvent={currentEvent}
                  elementHist={bootstrapHist?.elements.find((elh: any) =>
                    elh.code == elementMapping().code
                  )}
                  deltaEvent={0}
                  fixtures={fixtures}
                  teams={bootstrap?.teams}
                  multiplier={1}
                  last5={last5}
                />
                <StatItem label={" "} value={" "} />
                <StatItem label={" "} value={" "} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppElementSummary;

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
      className={`w-60 h-14 md:w-96 md:h-20 py-1 px-3 md:py-3 md:px-5 flex justify-center items-center bg-yellow-200 space-x-2`}
    >
      <TriangleAlert className="w-6 h-6" />
      <p className="text-xs md:text-sm">{news}</p>
    </div>
  );
};
