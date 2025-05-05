"use client";
import { useEffect, useState } from "react";
import AppElements from "./AppElements";
import AppElementList from "./AppElementList";
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
import withQueryClientProvider from "../react-query/MainProvider";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { getLocalStorageUsagePercentage, sectionClassName } from "@/utils";
import { AppNextFixturesSimplify } from './AppNextFixtures'

const MainPageWithProvider = () => {
  return (<MainPageContent />);
};

const MainPage = withQueryClientProvider(MainPageWithProvider);
export default MainPage;

const MainPageContent = () => { 
  const [storageUsage, setStorageUsage] = useState<number>(0);
  const { bootstrap, isLoadingBootstrap, errorBootstrap } = useBootstrap();
  useEffect(() => {
    setStorageUsage(getLocalStorageUsagePercentage());
  })

  const handleClearStorage = () => {
    localStorage.clear();
    setStorageUsage(getLocalStorageUsagePercentage());
    window.location.reload();
  };
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
      <div className={sectionClassName}>
        <AppTransferDeadline bootstrap={bootstrap} />
      </div>

      <div className={sectionClassName}>
        <AppWildCardNextFixtures />
      </div>

      <div className={sectionClassName}>
        <AppElements className="w-full" />
        {/* <AppElementList className="w-full" bootstrap={bootstrap} /> */}
      </div>

      <div className={sectionClassName}>
        <AppFixtures
          teams={bootstrap?.teams}
          events={bootstrap?.events}
          elements={bootstrap?.elements}
          element_stats={bootstrap?.element_stats}
        />
      </div>

      <div className={sectionClassName}>
        <div className="flex flex-col space-y-1 justify-center items-center">
          <p className="text-xs">storage usage</p>
          <Progress  value={storageUsage}/>
          <Button variant="outline" onClick={handleClearStorage}>Clear Storage &amp; Refresh</Button>
        </div>
      </div>
    </div>
  );
};
