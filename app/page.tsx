import PlayerCard from "@/components/PlayerCard";
import PlayerList from "@/components/PlayerList";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center pt-24">
      <div className="align-center">
        {/* <PlayerCard name="Haaland" firstLastName="Erling Haaland" image="https://resources.premierleague.com/premierleague/photos/players/250x250/p223094.png" position="FWD" team="MCI" tsb={15.8} price={15.0} nextMatches={['CHE', 'IPS', 'MUN', 'TOT', 'CRY']} /> */}
        <PlayerList />
      </div>
    </main>
  );
}
