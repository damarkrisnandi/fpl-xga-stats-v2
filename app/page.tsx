// import AppFixtures from "@/components/main/AppFixtures";
// import AppLeagueSummary from "@/components/main/AppLeagueSummary";
// import AppTransferDeadline from "@/components/main/AppTransferDeadline";
import { getBootstrap } from "@/services";
import { leaguesData } from "@/utils";
import dynamic from "next/dynamic";
import Image from "next/image";

const AppTransferDeadline = dynamic(
  () => import("@/components/main/AppTransferDeadline")
);
const AppLeagueSummary = dynamic(
  () => import("@/components/main/AppLeagueSummary")
);
const AppFixtures = dynamic(() => import("@/components/main/AppFixtures"));

export default async function Home() {
  const bootstrap = await getBootstrap();
  // const currentLeagues = leaguesData
  //   .filter((league) => league.current)[0]
  //   .children.filter((child: any) => child.league)
  //   .map((l: any) => {
  //     return { ...l, motwExist: l.name == "League B" ? false : true };
  //   });

  return (
    <main className="flex min-h-screen flex-col items-center pt-24">
      <AppTransferDeadline bootstrap={bootstrap} />
      <AppFixtures teams={bootstrap?.teams} events={bootstrap?.events} elements={bootstrap?.elements} element_stats={bootstrap?.element_stats}/>
      
    </main>
  );
}
