"use client";
import { useEffect, useState } from "react";
import AppElements from "./AppElements";
import AppFixtures from "./AppFixtures";
import AppTransferDeadline from "./AppTransferDeadline";
import { getBootstrapFromStorage } from "@/services";
import AppSpinner from "./AppSpinner";
import AppFailedToFetch from "./AppFailedToFetch";

const MainPage = () => {
  const [bootstrap, setBootstrap] = useState<any>(null);
  useEffect(() => {
    if (!bootstrap) {
      getBootstrapFromStorage().then((value: any) => {
        setBootstrap(value);
      });
    }
  });
  if (!bootstrap) {
    return (
      <div className="flex justify-center items-center h-screen">
        <AppSpinner />
      </div>
    );
  }

  if (bootstrap && bootstrap.error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <AppFailedToFetch />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center">
      <AppTransferDeadline bootstrap={bootstrap} />
      <AppFixtures
        teams={bootstrap?.teams}
        events={bootstrap?.events}
        elements={bootstrap?.elements}
        element_stats={bootstrap?.element_stats}
      />
      <AppElements className="w-full" bootstrap={bootstrap}/>
    </div>
  );
};

export default MainPage;
