"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Hourglass } from "lucide-react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { getBootstrapFromStorage } from "@/services";
import useBootstrap from "@/hooks/use-bootstrap";
import useDeadline from "@/hooks/use-deadline";

const TimerContainer = (props: any) => {
  return (
    <div className="bg-slate-600 w-16 h-16 flex justify-center items-center rounded">
      <div className="flex justify-center items-center flex-col">
        <p className="text-3xl font-bold text-white">{props.time}</p>
        <p className="text-xs text-white">{props.unit}</p>
      </div>
    </div>
  );
};

const AppTransferDeadline = (props: any) => {
  // const { bootstrap } = props;
  const queryClient = new QueryClient();

  const { bootstrap, isLoadingBootstrap, errorBootstrap } = useBootstrap();
 
  const { event, deadline } = useDeadline({ bootstrap });

  if (!event || !deadline) {
    return <SkeletonCard />;
  }

  if (isLoadingBootstrap) {
    return <SkeletonCard />;
  }

  return (
    <Card className="w-full mb-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          {event?.name}
          <Hourglass className="h-5 w-5 font-bold ml-3" />
        </CardTitle>
        <CardDescription>Transfer Deadline</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        {deadline && (
          <div className="flex space-x-1">
            <TimerContainer time={deadline.days} unit="days" />
            <TimerContainer time={deadline.hours} unit="hours" />
            <TimerContainer time={deadline.minutes} unit="minutes" />
            <TimerContainer time={deadline.seconds} unit="seconds" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppTransferDeadline;

function SkeletonCard() {
  return (
    <Card className="w-11/12 md:w-5/12 mb-2">
      <CardHeader>
        <Skeleton className="w-4/5 h-5" />
        <Skeleton className="w-2/5 h-2" />
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <div className="flex space-x-1">
          <Skeleton className="w-16 h-16 rounded" />
          <Skeleton className="w-16 h-16 rounded" />
          <Skeleton className="w-16 h-16 rounded" />
          <Skeleton className="w-16 h-16 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
