import { useEffect, useState } from "react";
import {
  difficultyColor,
  getExpectedPoints,
  getPlayerPhotoUrl,
  getTeamLogoUrl,
  positionMapping,
  xPColor,
} from "@/utils";

const AppNextFixtures = (props: any) => {
  const { teams, element, nextFixtures, isSimplify } = props;
  const getTeamShort = (code: number) => {
    return teams.find((team: any) => team.id === code)?.short_name || "";
  };

  if (isSimplify) {
    return (
      <div>
        {nextFixtures
          .map((nextf: any, index: number) => {
            const Difficulties = [
              (props: any) => null,
              (props: any) => <Difficulty1 {...props} />,
              (props: any) => <Difficulty2 {...props} />,
              (props: any) => <Difficulty3 {...props} />,
              (props: any) => <Difficulty4 {...props} />,
              (props: any) => <Difficulty5 {...props} />,
            ];
            if (element.team == nextf.team_h) {
              const Difficulty: any = Difficulties[nextf.team_h_difficulty];
              return (
                <Difficulty
                  key={nextf.id}
                  team={`${getTeamShort(nextf.team_a)} (H)`}
                />
              );
            } else {
              const Difficulty: any = Difficulties[nextf.team_a_difficulty];
              return (
                <Difficulty
                  key={nextf.id}
                  team={`${getTeamShort(nextf.team_h)} (A)`}
                />
              );
            }
          })}
      </div>
    )
  }
  return (
    <div
      className={`w-14 h-14 md:w-24 md:h-24 flex flex-col justify-center items-center bg-slate-200`}
    >
      <p className="text-xs md:text-sm">Next</p>
      <div>
        {nextFixtures
          .map((nextf: any, index: number) => {
            const Difficulties = [
              (props: any) => null,
              (props: any) => <Difficulty1 {...props} />,
              (props: any) => <Difficulty2 {...props} />,
              (props: any) => <Difficulty3 {...props} />,
              (props: any) => <Difficulty4 {...props} />,
              (props: any) => <Difficulty5 {...props} />,
            ];
            if (element.team == nextf.team_h) {
              const Difficulty: any = Difficulties[nextf.team_h_difficulty];
              return (
                <Difficulty
                  key={nextf.id}
                  team={`${getTeamShort(nextf.team_a)} (H)`}
                />
              );
            } else {
              const Difficulty: any = Difficulties[nextf.team_a_difficulty];
              return (
                <Difficulty
                  key={nextf.id}
                  team={`${getTeamShort(nextf.team_h)} (A)`}
                />
              );
            }
          })}
      </div>
    </div>
  );
};

export const AppCurrentFixtures = (props: any) => {
  const { teams, element, currentFixtures } = props;
  const getTeamShort = (code: number) => {
    return teams.find((team: any) => team.id === code)?.short_name || "";
  };

  return (
    <div
      className={`w-14 h-14 md:w-24 md:h-24 flex flex-col justify-center items-center bg-slate-200`}
    >
      <p className="text-xs md:text-sm">vs</p>
      <div>
        {currentFixtures
          .map((currentf: any, index: number) => {
            const Difficulties = [
              (props: any) => null,
              (props: any) => <Difficulty1 {...props} />,
              (props: any) => <Difficulty2 {...props} />,
              (props: any) => <Difficulty3 {...props} />,
              (props: any) => <Difficulty4 {...props} />,
              (props: any) => <Difficulty5 {...props} />,
            ];
            if (element.team == currentf.team_h) {
              const Difficulty: any = Difficulties[currentf.team_h_difficulty];
              return (
                <Difficulty
                  key={currentf.id}
                  team={`${getTeamShort(currentf.team_a)} (H)`}
                />
              );
            } else {
              const Difficulty: any = Difficulties[currentf.team_a_difficulty];
              return (
                <Difficulty
                  key={currentf.id}
                  team={`${getTeamShort(currentf.team_h)} (A)`}
                />
              );
            }
          })}
      </div>
    </div>
  );
};

export default AppNextFixtures;

const Difficulty1 = (props: any) => {
  const { team } = props;
  return (
    <div className={`text-center text-xs md:text-lg font-semibold bg-green-700 text-white`}>
      {team}
    </div>
  );
};

const Difficulty2 = (props: any) => {
  const { team } = props;
  return (
    <div className={`text-center text-xs md:text-lg font-semibold bg-green-500 text-white`}>
      {team}
    </div>
  );
};

const Difficulty3 = (props: any) => {
  const { team } = props;
  return (
    <div className={`text-center text-xs md:text-lg font-semibold border-1 border-black`}>
      {team}
    </div>
  );
};

const Difficulty4 = (props: any) => {
  const { team } = props;
  return (
    <div className={`text-center text-xs md:text-lg font-semibold bg-red-500 text-white`}>
      {team}
    </div>
  );
};

const Difficulty5 = (props: any) => {
  const { team } = props;
  return (
    <div className={`text-center text-xs md:text-lg font-semibold bg-red-900 text-white`}>
      {team}
    </div>
  );
};
