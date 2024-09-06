import { solve } from "yalps";

export const leaguesData = [
  
];

export const menuTree = [
  {
    name: "Main",
    current: true,
    children: [
      {
        name: "Home",
        id: "",
      },
      {
        name: "Live Event",
        id: "live-event",
      },
      {
        name: "My Team",
        id: "my-team",
      },
    ],
  },
];

export const currentSeason = "2024-2025";
export const previousSeason = "2023-2024";

export function getPlayerPhotoUrl(photo: string): string {
  const imageId = photo?.split(".")[0] || "";
  return `https://resources.premierleague.com/premierleague/photos/players/250x250/p${imageId}.png`;
}

export function getTeamLogoUrl(id: number): string {
  return `https://resources.premierleague.com/premierleague/badges/70/t${id}.png`;
}

export function difficultyColor(code: number): string {
  let className = "";
  const classArr = [
    "",
    "bg-green-700 text-white",
    "bg-green-500 text-white",
    "",
    "bg-red-500 text-white",
    "bg-red-900 text-white",
  ];
  switch (code) {
    case 1:
      className = "bg-green-700 text-white";
      break;
    case 2:
      className = "bg-green-500 text-white";
      break;
    case 3:
      break;
    case 4:
      className = "bg-red-500 text-white";
      break;
    case 5:
      className = "bg-red-900 text-white";
      break;
    default:
      break;
  }

  return classArr[code];
}

export function xPColor(value: number): string {
  if (value < 3) {
    return "text-red-700";
  } else if (value < 4) {
    return "text-yellow-500";
  } else if (value < 6) {
    return "text-lime-400";
  } else if (value < 9) {
    return "text-green-600";
  }

  return "text-green-700";
}
export function positionMapping(code: number): string {
  const position: any = {
    1: "GKP",
    2: "DEF",
    3: "MID",
    4: "FWD",
  };

  return position[code] || "";
}

export function statsMapping(code: string): string {
  const stats: any = {
    minutes: "🕑",
    goals_scored: "⚽️",
    assists: "👟",
    clean_sheets: "🔰",
    goals_conceded: "❌",
    own_goals: "x⚽️x",
    penalties_saved: "PS",
    penalties_missed: "PM",
    yellow_cards: "🟨",
    red_cards: "🟥",
    saves: "🧤",
    bonus: "⭐",
    bps: "BPS",
  };
  return stats[code] || "";
}

const calculateBaseExpected = (element: any, fixturesLen: number) => {
  let xP = 0;
  const {
    element_type,
    bonus,
    expected_goals_per_90,
    expected_assists_per_90,
    starts_per_90,
    clean_sheets_per_90,
    own_goals,
    expected_goals_conceded_per_90,
    saves,
    minutes,
    bps,
    yellow_cards,
    red_cards,
    goals_scored,
    assists,

  } = element;
  const indexPer90 = minutes > 0 ? (90 / minutes) : 0;
  const xYC = (yellow_cards * indexPer90) * -1;
  const xRC = (red_cards * indexPer90) * -2;
  const pMP = starts_per_90 >= 0.67 ? 2 : starts_per_90 == 0 ? 0 : 1;
  const xOG = (own_goals * indexPer90) * -1;
  const goalp90 = goals_scored * indexPer90;
  const assistp90 = assists * indexPer90; 
  if (element_type === 4) {
    const xPG = ((expected_goals_per_90 + goalp90) / 2) * 4;
    const xPA = ((expected_assists_per_90 + assistp90) / 2) * 3;
    xP = xPG + xPA;
  }
  if (element_type === 3) {
    const xPG = ((expected_goals_per_90 + goalp90) / 2) * 5;
    const xPA = ((expected_assists_per_90 + assistp90) / 2) * 3;
    const xCS = clean_sheets_per_90 >= 0.67 ? 1 : 0;
    const xGC = Math.floor(expected_goals_conceded_per_90 / 2) * -1;
    xP = xPG + xPA + xGC ;
  }
  if (element_type === 2) {
    const xPG = ((expected_goals_per_90 + goalp90) / 2) * 6;
    const xPA = ((expected_assists_per_90 + assistp90) / 2) * 3;
    const xCS = starts_per_90 >= 0.67 ? (clean_sheets_per_90 >= 0.67 ? 4 : 0) : 0;
    const xGC = Math.floor(expected_goals_conceded_per_90 / 2) * -1;
    xP = xPG + xPA + xGC ;
  }

  if (element_type === 1) {
    const xPG = ((expected_goals_per_90 + goalp90) / 2) * 10;
    const xPA = ((expected_assists_per_90 + assistp90) / 2) * 3;
    const xCS = starts_per_90 >= 0.67 ? (clean_sheets_per_90 >= 0.67 ? 4 : 0) : 0;
      const xGC = Math.floor(expected_goals_conceded_per_90 / 2) * -1;
    const xSaves = Math.floor((saves * indexPer90) / 3);
    xP =
      xPG +
      xPA +
      xGC +
      xSaves ;
  }

  xP += pMP + xOG ;

  return xP;
}

export const getExpectedPoints = (
  element: any,
  currentGameWeek: number,
  deltaEvent: number,
  fixtures: any,
  teams: any,
  elementHistory?: any
) => {
  let gameWeek = currentGameWeek + deltaEvent;

  if (gameWeek > 38) {
    return 0;
  } else if (gameWeek < 1) {
    // bisa pake history data bootstrap static
    return 0;
  }

  let xP = 0;
  const filteredFixtures = fixtures.filter(
    (fix: any) =>
      (element.team == fix.team_h || element.team == fix.team_a) &&
      fix.event <= gameWeek
  );

  xP = calculateBaseExpected(element, filteredFixtures.length)

  let xPHistory = 0;
  if (elementHistory) {
    xPHistory = calculateBaseExpected(elementHistory, 38);
  }

  if (elementHistory) {
    if (gameWeek == 0) {
      xP = xPHistory;
    } else {
      xP = (0.85 * xP) + (0.15 * xPHistory);
    }
  } else  {
    
  }

  const elementStatusIndex: any = {
    a: 1,
    d: element.chance_of_playing_next_round / 100,
    i: element.chance_of_playing_next_round / 100,
    u: 0,
    s: 0,
  };

  const diffRef: any = {
    1: 1.2,
    2: 1.04,
    3: 0.96,
    4: 0.88,
    5: 0.8,
  };
  let diffIndex = 1;
  const filteredfixturesByGameweek = fixtures.filter(
    (fix: any) =>
      fix.event == gameWeek &&
      (element.team == fix.team_h || element.team == fix.team_a)
  );
  let totalXP = 0;

  const getHomeAwayIndex = (
    element: any,
    teamData: any,
    opponentData: any,
    isHome: boolean
  ) => {
    let haIdxValue = 1;

    const homeOff = teamData.strength_attack_home;
    const homeDef = teamData.strength_defence_home;
    const awayOff = teamData.strength_attack_away;
    const awayDef = teamData.strength_defence_away;

    const homeOvr = teamData.strength_overall_home;
    const awayOvr = teamData.strength_overall_away;

    const homeOffOpp = opponentData.strength_attack_home;
    const homeDefOpp = opponentData.strength_defence_home;
    const awayOffOpp = opponentData.strength_attack_away;
    const awayDefOpp = opponentData.strength_defence_away;

    const homeOvrOpp = opponentData.strength_overall_home;
    const awayOvrOpp = opponentData.strength_overall_away;

    if (isHome) {
      switch (element.element_type) {
        case 4:
          haIdxValue =
            (1 * (homeOff - awayDefOpp)) / awayOvrOpp +
            (0 * (homeDef - awayOffOpp)) / awayOvrOpp;
          break;
        case 3:
          haIdxValue =
            ((8 / 9) * (homeOff - awayDefOpp)) / awayOvrOpp +
            ((1 / 9) * (homeDef - awayOffOpp)) / awayOvrOpp;
          break;
        case 2:
          haIdxValue =
            ((9 / 15) * (homeOff - awayDefOpp)) / awayOvrOpp +
            ((6 / 15) * (homeDef - awayOffOpp)) / awayOvrOpp;
          break;
        case 1:
          haIdxValue =
            (0 * (homeOff - awayDefOpp)) / awayOvrOpp +
            (1 * (homeDef - awayOffOpp)) / awayOvrOpp;
          break;
        default:
          break;
      }
    } else {
      switch (element.element_type) {
        case 4:
          haIdxValue =
            (1 * (awayOff - homeDefOpp)) / homeOvrOpp +
            (0 * (awayDef - homeOffOpp)) / homeOvrOpp;
          break;
        case 3:
          haIdxValue =
            ((8 / 9) * (awayOff - homeDefOpp)) / homeOvrOpp +
            ((1 / 9) * (awayDef - homeOffOpp)) / homeOvrOpp;
          break;
        case 2:
          haIdxValue =
            ((9 / 15) * (awayOff - homeDefOpp)) / homeOvrOpp +
            ((6 / 15) * (awayDef - homeOffOpp)) / homeOvrOpp;
          break;
        case 1:
          haIdxValue =
            (0 * (awayOff - homeDefOpp)) / homeOvrOpp +
            (1 * (awayDef - homeOffOpp)) / homeOvrOpp;
          break;
        default:
          break;
      }
    }

    return haIdxValue;
  };

  for (let fixture of filteredfixturesByGameweek) {
    if (element.team == fixture.team_h) {
      diffIndex =
        diffRef[fixture.team_h_difficulty] +
        getHomeAwayIndex(
          element,
          teams.find((t: any) => t.id == fixture.team_h),
          teams.find((t: any) => t.id == fixture.team_a),
          true
        );
    } else if (element.team == fixture.team_a) {
      diffIndex =
        diffRef[fixture.team_a_difficulty] +
        getHomeAwayIndex(
          element,
          teams.find((t: any) => t.id == fixture.team_a),
          teams.find((t: any) => t.id == fixture.team_h),
          false
        );
    }

    xP = xP * element.starts_per_90 * diffIndex * elementStatusIndex[element.status];

    totalXP += xP;
  }

  return totalXP;
};

const wildcardOptimizationModel = (
  elements: any,
  fixtures: any,
  teams: any,
  currentEvent: any,
  deltaEvent: number
  ) => {
    elements.sort((a: any, b: any) => a.element_type - b.element_type);
    
    elements.sort((a: any, b: any) => {
      return b["xp"] - a["xp"];
    });

    // const playerConstraints = Object.fromEntries(mandatoryPlayer.map(p => [p, {"equal": 1}]))
    const teamConstaints = Object.fromEntries(
      elements.map((e: any) => [`team_${e.team_code}`, { max: 3 }])
    );

    // only integers
    const fplInts = Object.fromEntries(
      elements.map((e: any) => [`player_${e.id}`, 1])
    );

    //#region pick optimization
    // variables
    const fplVariables2 = createVariables(
      elements,
      fixtures,
      teams,
      "",
      (v: any) => {
        return v;
      },
      [],
      currentEvent.id + deltaEvent
    );
    // const fplCaptaincyVariables2 = createVariables('*', (v) => optimizedSquad.includes(v.web_name), [[`capt_check`, 1],], checkGw)

    // constraints
    const maxPick2 = Object.fromEntries(
      elements.map((e: any) => [`player_${e.id}`, { max: 1, min: 0 }])
    );
    const posConstraints2 = {
      gkp: { equal: 2 },
      def: { equal: 5 },
      mid: { equal: 5 },
      fwd: { equal: 3 },
    };
    // const playerConstraints2 = Object.fromEntries(mandatoryPlayer.map(p => [p, {"min": 0, "max": 1}]))

    // pick optimization model
    return {
      direction: "maximize" as const,
      objective: "xp",
      constraints: {
        ...maxPick2,
        now_cost: {max: 1000},
        ...posConstraints2,
        ...teamConstaints,
        max_pick: { equal: 15 },
      },
      variables: {
        ...fplVariables2,
        // ...fplCaptaincyVariables2
      },
      integers: [...Object.keys(fplInts)],
    };
}

const picksOptimizationModel = (
  elements: any,
  fixtures: any,
  teams: any,
  currentEvent: any,
  deltaEvent: number,
  picksData?: any
  ) => {
  elements.sort((a: any, b: any) => a.element_type - b.element_type);
    const elements1 = elements.filter((el: any) =>
      picksData.picks.map((a: any) => a.element).includes(el.id)
    );
    elements1.sort((a: any, b: any) => {
      return b["xp"] - a["xp"];
    });

    // const playerConstraints = Object.fromEntries(mandatoryPlayer.map(p => [p, {"equal": 1}]))
    const teamConstaints = Object.fromEntries(
      elements1.map((e: any) => [`team_${e.team_code}`, { max: 3 }])
    );

    // only integers
    const fplInts = Object.fromEntries(
      elements1.map((e: any) => [`player_${e.id}`, 1])
    );

    //#region pick optimization
    // variables
    const fplVariables2 = createVariables(
      elements1,
      fixtures,
      teams,
      "",
      (v: any) => {
        return v;
      },
      [],
      currentEvent.id + deltaEvent
    );
    // const fplCaptaincyVariables2 = createVariables('*', (v) => optimizedSquad.includes(v.web_name), [[`capt_check`, 1],], checkGw)

    // constraints
    const maxPick2 = Object.fromEntries(
      elements1.map((e: any) => [`player_${e.id}`, { max: 1, min: 0 }])
    );
    const posConstraints2 = {
      gkp: { min: 1, max: 1 },
      def: { min: 3, max: 5 },
      mid: { min: 2, max: 5 },
      fwd: { min: 1, max: 3 },
    };
    // const playerConstraints2 = Object.fromEntries(mandatoryPlayer.map(p => [p, {"min": 0, "max": 1}]))

    // pick optimization model
    return {
      direction: "maximize" as const,
      objective: "xp",
      constraints: {
        ...maxPick2,
        // "now_cost": {"max": money},
        ...posConstraints2,
        // ...playerConstraints2,
        ...teamConstaints,
        max_pick: { max: 11 },
      },
      variables: {
        ...fplVariables2,
        // ...fplCaptaincyVariables2
      },
      integers: [...Object.keys(fplInts)],
    };
}

export const optimizationProcess = (
  elements: any,
  elementsHistory: any,
  fixtures: any,
  teams: any,
  currentEvent: any,
  deltaEvent: number,
  picksData?: any
) => {
  try {
    let picksData1;
    if (!picksData) {
      picksData1 = { picks: elements.map((el: any) => { return { element: el.id }})}
    } else {
      picksData1 = picksData;
    }
   let model: any = picksOptimizationModel(elements, fixtures, teams, currentEvent, deltaEvent, picksData1);
   if (!picksData) {
    model = wildcardOptimizationModel(elements, fixtures, teams, currentEvent, deltaEvent);
   }

    const solution2 = solve(model);
    if (!picksData) {
      picksData1 = {picks: solution2.variables.map((sol: any) => { return { element: elements.find((e: any) => e.id == Number(sol[0].split('_')[1])).id }})}
    }
    
    const benched = picksData ? picksData1.picks
      .map((p: any, index: number) => {
        return {
          ...p,
          multiplier: 0,
          web_name: elements.find((el: any) => el.id == p.element).web_name,
          xp: getExpectedPoints(
            elements.find((e: any) => e.id == p.element),
            currentEvent.id,
            deltaEvent,
            fixtures,
            teams,
            elementsHistory.find((eh: any) => elements.find((el: any) => el.id == p.element).code == eh.code)
          ),
        };
      })
      .filter(
        (p: any) =>
          !solution2.variables.map((v: any) => Number(v[0].split('_')[1])).includes(p.element)
      ) : [];

    const solutionAsObject: any[] = [
      ...solution2.variables.map((v: any, idx: number) => {
        return {
          element: elements.find((e: any) => e.id == Number(v[0].split('_')[1])).id,
          position: idx + 1,
          is_captain: false,
          is_vice_captain: false,
          multiplier: 1,
          xp: getExpectedPoints(
            elements.find((e: any) => e.id == Number(v[0].split('_')[1])),
            currentEvent.id,
            deltaEvent,
            fixtures,
            teams,
            elementsHistory.find((eh: any) => elements.find((el: any) => el.id == Number(v[0].split('_')[1])).code == eh.code)
          ),
        };
      }),
      ...benched,
    ];

    const captaincySolution = solutionAsObject.toSorted((a: any, b: any) => b.xp - a.xp).slice(0, 2);

    const result = solutionAsObject.map((res: any, idx: number) => {
      return {
        ...res,
        web_name: elements.find((el: any) => el.id == res.element).web_name,
        position: idx + 1,
        multiplier: captaincySolution[0].element == res.element ? 2 : res.multiplier,
        is_captain: captaincySolution[0].element == res.element ? true : false,
        is_vice_captain: captaincySolution[1].element == res.element ? true : false
      };
    });

    return result;
  } catch (error) {
    console.log(error);
    // willReplace += 1;
    // console.log(`replace + 1 = ${willReplace}`)
  }

  return [];
};

/**
 * create variable models
 * @param {string} suffix
 * @param {function} filterCat
 * @param {Array} addEntries
 * @returns
 */
const createVariables = (
  elements: any,
  fixtures: any,
  teams: any,
  suffix: any,
  filterCat: any,
  addEntries: any,
  inputGw?: any
) =>
  Object.fromEntries(
    elements
      .map((e: any) => {
        const picksData = {
          picks: [
            {
              element: parseInt(e.id),
              multiplier: 1,
            },
          ],
        };

        let entries = Object.fromEntries([
          [`player_${e.id}`, 1],
          ...addEntries,
          ["fwd", e.element_type == 4 ? 1 : 0],
          ["mid", e.element_type == 3 ? 1 : 0],
          ["def", e.element_type == 2 ? 1 : 0],
          ["gkp", e.element_type == 1 ? 1 : 0],
          ["xp", getExpectedPoints(e, inputGw, 0, fixtures, teams)],
          ["xp_next_2", getExpectedPoints(e, inputGw, 1, fixtures, teams)],
          ["xp_next_3", getExpectedPoints(e, inputGw, 2, fixtures, teams)],
          ["xp_sigm_3", getExpectedPoints(e, inputGw, 0, fixtures, teams) + getExpectedPoints(e, inputGw, 1, fixtures, teams) + getExpectedPoints(e, inputGw, 2, fixtures, teams)],
          [
            "surplus_point",
            e.event_points - getExpectedPoints(e, inputGw, 0, fixtures, teams),
          ],

          [`team_${e.team_code}`, 1],
          [`is_playing`, e.status === "a" ? 1 : 0],
        ]);

        return {
          ...e,
          max_pick: 1,
          ...entries,
        };
      })
      .filter(filterCat)
      .map((e: any) => [`player_${e.id}`, e])
  );
