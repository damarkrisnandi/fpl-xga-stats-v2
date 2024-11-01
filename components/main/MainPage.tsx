"use client";
import { useEffect, useState } from "react";
import AppElements from "./AppElements";
import AppFixtures from "./AppFixtures";
import AppTransferDeadline from "./AppTransferDeadline";
import { getBootstrapFromStorage } from "@/services";
import AppSpinner from "./AppSpinner";
import AppFailedToFetch from "./AppFailedToFetch";
import AppWildCardNextFixtures from "./AppWildCardNextFixtures";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import AppScatterPlot from "./AppScatterPlot";
import useBootstrap from "@/hooks/use-bootstrap";

const queryClient = new QueryClient();
const MainPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MainPageContent />
    </QueryClientProvider>
  );
};

export default MainPage;

const MainPageContent = () => { 
  const { bootstrap, isLoadingBootstrap, errorBootstrap } = useBootstrap();
  if (isLoadingBootstrap) {
    return (
      <div className="flex justify-center items-center h-screen">
        <AppSpinner />
      </div>
    );
  }
  if (errorBootstrap) {
    return (
      <div className="flex justify-center items-center h-screen">
        <AppFailedToFetch />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <AppTransferDeadline bootstrap={bootstrap} />

      <Tabs defaultValue="wildcard" className="w-11/12 md:w-5/12 mb-2">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="wildcard">Wildcard</TabsTrigger>
          <TabsTrigger value="stats">Player Stats</TabsTrigger>
        </TabsList>
        <TabsContent
          value="wildcard"
          className="flex flex-col items-center w-full"
        >
          <AppWildCardNextFixtures />
        </TabsContent>
        <TabsContent value="stats">
          <AppElements className="w-full" />
        </TabsContent>
      </Tabs>

      <AppFixtures
        teams={bootstrap?.teams}
        events={bootstrap?.events}
        elements={bootstrap?.elements}
        element_stats={bootstrap?.element_stats}
      />
    </div>
  );
};
