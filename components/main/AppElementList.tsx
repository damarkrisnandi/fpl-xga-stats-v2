"use client";

// import {
//   getArchivedBootstrap,
//   getBootstrapFromStorage,
//   getFixtures,
// } from "@/services";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../ui/card";
// import { useEffect, useState } from "react";
// import AppFailedToFetch from "./AppFailedToFetch";
// import { Skeleton } from "../ui/skeleton";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
// import { ScrollArea } from "../ui/scroll-area";
// import {
//   CirclePercent,
//   Euro,
//   PoundSterling,
//   RefreshCw,
//   TriangleAlert,
// } from "lucide-react";
// import { Avatar, AvatarImage } from "../ui/avatar";
// import {
//   difficultyColor,
//   getExpectedPoints,
//   getPlayerPhotoUrl,
//   getTeamLogoUrl,
//   positionMapping,
//   previousSeason,
//   xPColor,
// } from "@/utils";
// import { Separator } from "../ui/separator";
// import Image from "next/image";
// import { Button } from "../ui/button";
// import Link from "next/link";
// import AppNextFixtures from "./AppNextFixtures";
// import AppExpectedPts from "./AppExpectedPts";
// import {
//   QueryClient,
//   QueryClientProvider,
//   useQueries,
//   useQuery,
// } from "@tanstack/react-query";
// import useBootstrap from "@/hooks/use-bootstrap";
// import useBootstrapHist from "@/hooks/use-bootstraphist";
// import useFixtures from "@/hooks/use-fixtures";
// import useCurrentEvent from "@/hooks/use-currentevent";
// import useNextEvent from "@/hooks/use-nextevent";
// import useLastFiveGw from "@/hooks/use-lastfivegw";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


function AppElementList(props: any) {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

export default AppElementList
