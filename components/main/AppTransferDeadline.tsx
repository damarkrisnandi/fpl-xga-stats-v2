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
  const { data: bootstrap, isLoading, error } = useQuery({
    queryKey: ["bootstrap"],
    queryFn: async () => await getBootstrapFromStorage(),
  });

  const [event, setEvent] = useState<any>(null);
  const [deadline, setDeadline] = useState<any>(null);
  // if (!bootstrap) {
  //   return null;
  // }

  useEffect(() => {
    const nextEvents = bootstrap.events.filter((event: any) =>
      new Date(event.deadline_time).getTime() > new Date().getTime()
    );
    if (!event) {
      setEvent(nextEvents.length ? nextEvents[0] : { id: 39 });
    }

    if (!deadline) {
      // Update the count down every 1 second
      const x = setInterval(function () {
        let countDownDate = new Date(
          nextEvents.length ? nextEvents[0].deadline_time : new Date(),
        ).getTime();
        // Get today's date and time
        const now = new Date().getTime();

        // Find the distance between now and the count down date
        const distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        // setDeadline(zeroPadded(days) + "d " + zeroPadded(hours) + "h "
        // + zeroPadded(minutes) + "m " + zeroPadded(seconds) + "s ");
        setDeadline({
          days: zeroPadded(days),
          hours: zeroPadded(hours),
          minutes: zeroPadded(minutes),
          seconds: zeroPadded(seconds),
        });

        // If the count down is finished, write some text
        if (distance < 0) {
          clearInterval(x);
          setDeadline(null);
        }
      }, 1000);
    }
  }, [event, deadline]);

  if (!event || !deadline) {
    return <SkeletonCard />;
  }

  if (isLoading) {
    return <SkeletonCard />;
  }

  return (
    <Card className="w-11/12 md:w-5/12 mb-2">
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

function zeroPadded(num: number) {
  if (num < 10) {
    return "0" + num.toString();
  }
  return num.toString();
}

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
