import { solve } from "yalps";


type LiveStat = {
  assists: number
  bonus: number
  bps: number
  clean_sheets: number
  creativity: string
  expected_assists: string;
  expected_goal_involvements: string;
  expected_goals: string;
  expected_goals_conceded: string;
  goals_conceded: number
  goals_scored: number
  ict_index: string
  in_dreamteam: boolean
  influence: string
  minutes: number
  own_goals: number
  penalties_missed: number
  penalties_saved: number
  red_cards: number
  saves: number
  starts: number
  threat: string
  total_points: number
  yellow_cards: number
}

export const leaguesData = [];

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
        name: "DataVis.",
        id: "data-visualization",
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

export const sectionClassName = "w-11/12 md:w-10/12 lg:w-7/12 mb-2";

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
    starts,
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
    const xCS = clean_sheets_per_90 >= 0.67 ? clean_sheets_per_90 : 0;
    const xGC = Math.floor(expected_goals_conceded_per_90 / 2) * -1;
    xP = xPG + xPA + xGC + xCS;
  }
  if (element_type === 2) {
    const xPG = ((expected_goals_per_90 + goalp90) / 2) * 6;
    const xPA = ((expected_assists_per_90 + assistp90) / 2) * 3;
    const xCS = starts_per_90 >= 0.67
      ? (clean_sheets_per_90 >= 0.67 ? (4 * clean_sheets_per_90) : 0)
      : 0;
    const xGC = Math.floor(expected_goals_conceded_per_90 / 2) * -1;
    xP = xPG + xPA + xGC + xCS;
  }

  if (element_type === 1) {
    const xPG = ((expected_goals_per_90 + goalp90) / 2) * 10;
    const xPA = ((expected_assists_per_90 + assistp90) / 2) * 3;
    const xCS = starts_per_90 >= 0.67
      ? (clean_sheets_per_90 >= 0.67 ? (4 * clean_sheets_per_90) : 0)
      : 0;
    const xGC = Math.floor(expected_goals_conceded_per_90 / 2) * -1;
    const xSaves = Math.floor((saves * indexPer90) / 3);
    xP = xPG +
      xPA +
      xGC +
      xSaves +
      xCS;
  }

  xP += pMP + xOG + xYC + xRC;
  const xMin = (minutes / (90 * fixturesLen))
  xP *= (xMin > 0.5) ? 1 : xMin;
  return xP;
};

const calculateBaseExpectedLast5 = (baseEl: any, stat5: { elements: {id: number, stats: LiveStat}[] }[] | null | undefined, fixturesLen: number) => {
  let xP5 = 0;
  let match = 0

  if (!stat5) return 0;

  for (let live of stat5.filter((el: any) => el.elements.find((e: any) => e.id === baseEl.id))) {
    match++;
    let xP = 0
    const {
      element_type,
      
    } = baseEl;

    const {
      // element_type,
      bonus,
      // expected_goals_per_90,
      // expected_assists_per_90,
      // starts_per_90,
      // clean_sheets_per_90,
      own_goals,
      // expected_goals_conceded_per_90,
      saves,
      minutes,
      bps,
      yellow_cards,
      red_cards,
      goals_scored,
      assists,
      starts,
      expected_goals,
      expected_assists,
      expected_goals_conceded,
      clean_sheets
    } = live.elements.find((el: any) => el.id === baseEl.id)?.stats || {} as LiveStat;

    const indexPer90 = minutes / 90 //minutes > 0 ? (90 / minutes) : 0;
    const xYC = (yellow_cards * indexPer90) * -1;
    const xRC = (red_cards * indexPer90) * -2;
    const pMP = starts >= 0.67 ? 2 : starts == 0 ? 0 : 1;
    const xOG = (own_goals * indexPer90) * -1;
    const goalp90 = goals_scored * indexPer90;
    const assistp90 = assists * indexPer90;
    if (element_type === 4) {
      const xPG = ((Number(expected_goals) + goalp90) / 2) * 4;
      const xPA = ((Number(expected_assists) + assistp90) / 2) * 3;
      xP = xPG + xPA;
    }
    if (element_type === 3) {
      const xPG = ((Number(expected_goals) + goalp90) / 2) * 5;
      const xPA = ((Number(expected_assists) + assistp90) / 2) * 3;
      const xCS = clean_sheets >= 0.67 ? clean_sheets : 0;
      const xGC = Math.floor(Number(expected_goals_conceded) / 2) * -1;
      xP = xPG + xPA + xGC + xCS;
    }
    if (element_type === 2) {
      const xPG = ((Number(expected_goals) + goalp90) / 2) * 6;
      const xPA = ((Number(expected_assists) + assistp90) / 2) * 3;
      const xCS = starts >= 0.67
        ? (clean_sheets >= 0.67 ? (4 * clean_sheets) : 0)
        : 0;
      const xGC = Math.floor(Number(expected_goals_conceded) / 2) * -1;
      xP = xPG + xPA + xGC + xCS;
    }

    if (element_type === 1) {
      const xPG = ((Number(expected_goals) + goalp90) / 2) * 10;
      const xPA = ((Number(expected_assists) + assistp90) / 2) * 3;
      const xCS = starts >= 0.67
        ? (clean_sheets >= 0.67 ? (4 * clean_sheets) : 0)
        : 0;
      const xGC = Math.floor(Number(expected_goals_conceded) / 2) * -1;
      const xSaves = Math.floor((saves * indexPer90) / 3);
      xP = xPG +
        xPA +
        xGC +
        xSaves +
        xCS;
    }

    
    xP += pMP + xOG + xYC + xRC;
    // const xMin = (minutes / (90 * fixturesLen))
    // xP *= (xMin > 0.5) ? 1 : xMin;
    
    xP5 += xP;
  }
  
  return xP5 / match;
  
}

const getHomeAwayIndex = (
  element: any,
  teamData: any,
  opponentData: any,
  isHome: boolean,
) => {
  let haIdxValue = 1;

  const homeOff = teamData.strength_attack_home;
  const homeDef = teamData.strength_defence_home;
  const awayOff = teamData.strength_attack_away;
  const awayDef = teamData.strength_defence_away;

  // const homeOvr = teamData.strength_overall_home;
  // const awayOvr = teamData.strength_overall_away;

  const homeOffOpp = opponentData.strength_attack_home;
  const homeDefOpp = opponentData.strength_defence_home;
  const awayOffOpp = opponentData.strength_attack_away;
  const awayDefOpp = opponentData.strength_defence_away;

  const homeOvrOpp = opponentData.strength_overall_home;
  const awayOvrOpp = opponentData.strength_overall_away;

  if (isHome) {
    switch (element.element_type) {
      case 4:
        haIdxValue = (1 * (homeOff - awayDefOpp)) / awayOvrOpp +
          (0 * (homeDef - awayOffOpp)) / awayOvrOpp;
        break;
      case 3:
        haIdxValue = ((8 / 9) * (homeOff - awayDefOpp)) / awayOvrOpp +
          ((1 / 9) * (homeDef - awayOffOpp)) / awayOvrOpp;
        break;
      case 2:
        haIdxValue = ((9 / 15) * (homeOff - awayDefOpp)) / awayOvrOpp +
          ((6 / 15) * (homeDef - awayOffOpp)) / awayOvrOpp;
        break;
      case 1:
        haIdxValue = (0 * (homeOff - awayDefOpp)) / awayOvrOpp +
          (1 * (homeDef - awayOffOpp)) / awayOvrOpp;
        break;
      default:
        break;
    }
  } else {
    switch (element.element_type) {
      case 4:
        haIdxValue = (1 * (awayOff - homeDefOpp)) / homeOvrOpp +
          (0 * (awayDef - homeOffOpp)) / homeOvrOpp;
        break;
      case 3:
        haIdxValue = ((8 / 9) * (awayOff - homeDefOpp)) / homeOvrOpp +
          ((1 / 9) * (awayDef - homeOffOpp)) / homeOvrOpp;
        break;
      case 2:
        haIdxValue = ((9 / 15) * (awayOff - homeDefOpp)) / homeOvrOpp +
          ((6 / 15) * (awayDef - homeOffOpp)) / homeOvrOpp;
        break;
      case 1:
        haIdxValue = (0 * (awayOff - homeDefOpp)) / homeOvrOpp +
          (1 * (awayDef - homeOffOpp)) / homeOvrOpp;
        break;
      default:
        break;
    }
  }

  return haIdxValue;
};

export const getExpectedPoints = (
  element: any,
  currentGameWeek: number,
  deltaEvent: number,
  fixtures: any,
  teams: any,
  elementHistory?: any,
  last5?: { elements: {id: number, stats: LiveStat}[] }[] | undefined | null
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
      fix.event <= gameWeek - 1,
  );

  if (last5) {
    xP = calculateBaseExpectedLast5(element, last5, last5.length);
  } else {
    xP = calculateBaseExpected(element, filteredFixtures.length);
  }
  

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
  } else {
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
      (element.team == fix.team_h || element.team == fix.team_a),
  );

  let totalXP = 0;

  for (let fixture of filteredfixturesByGameweek) {
    if (element.team == fixture.team_h) {
      if (deltaEvent < 0 && !fixture.finished) {
        return 0;
      }
      diffIndex = diffRef[fixture.team_h_difficulty] +
        getHomeAwayIndex(
          element,
          teams.find((t: any) => t.id == fixture.team_h),
          teams.find((t: any) => t.id == fixture.team_a),
          true,
        );
    } else if (element.team == fixture.team_a) {
      if (deltaEvent < 0 && !fixture.finished) {
        return 0;
      }
      diffIndex = diffRef[fixture.team_a_difficulty] +
        getHomeAwayIndex(
          element,
          teams.find((t: any) => t.id == fixture.team_a),
          teams.find((t: any) => t.id == fixture.team_h),
          false,
        );
    }

    xP = xP * element.starts_per_90 * diffIndex *
      elementStatusIndex[element.status];

    totalXP += xP;
  }

  // current match check
  // const currentFixtures = fixtures.filter(
  //   (fix: any) =>
  //     fix.event == currentGameWeek &&
  //     (element.team == fix.team_h || element.team == fix.team_a)
  // );
  // for (let fixture of currentFixtures) {
  //   if (element.team == fixture.team_h) {
  //     if (deltaEvent < 0 && !fixture.started) {
  //       totalXP = 0;
  //     }
  //   } else if (element.team == fixture.team_a) {
  //     if (deltaEvent < 0 && !fixture.started) {
  //       totalXP = 0;
  //     }
  //   }
  //   continue;
  // }

  return totalXP;
};

const wildcardOptimizationModel = (
  elements: any,
  elementsHistory: any,
  fixtures: any,
  teams: any,
  currentEvent: any,
  deltaEvent: number,
  last5?: any
) => {
  elements.sort((a: any, b: any) => a.element_type - b.element_type);

  elements.sort((a: any, b: any) => {
    return b["xp"] - a["xp"];
  });

  // const playerConstraints = Object.fromEntries(mandatoryPlayer.map(p => [p, {"equal": 1}]))
  const teamConstaints = Object.fromEntries(
    elements.map((e: any) => [`team_${e.team_code}`, { max: 3 }]),
  );

  // only integers
  const fplInts = Object.fromEntries(
    elements.map((e: any) => [`player_${e.id}`, 1]),
  );

  //#region pick optimization
  // variables
  const fplVariables2 = createVariables(
    elements,
    elementsHistory,
    fixtures,
    teams,
    "",
    (v: any) => {
      return v;
    },
    [],
    currentEvent.id,
    last5
  );
  // constraints
  const maxPick2 = Object.fromEntries(
    elements.map((e: any) => [`player_${e.id}`, { max: 1, min: 0 }]),
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
      now_cost: { max: 1000 },
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
};

const picksOptimizationModel = (
  elements: any,
  elementsHistory: any,
  fixtures: any,
  teams: any,
  currentEvent: any,
  deltaEvent: number,
  picksData?: any,
  last5?: any
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
    elements1.map((e: any) => [`team_${e.team_code}`, { max: 3 }]),
  );

  // only integers
  const fplInts = Object.fromEntries(
    elements1.map((e: any) => [`player_${e.id}`, 1]),
  );

  //#region pick optimization
  // variables
  const fplVariables2 = createVariables(
    elements1,
    elementsHistory,
    fixtures,
    teams,
    "",
    (v: any) => {
      return v;
    },
    [],
    currentEvent.id,
    last5
  );

  // constraints
  const maxPick2 = Object.fromEntries(
    elements1.map((e: any) => [`player_${e.id}`, { max: 1, min: 0 }]),
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
};

export const optimizationProcess = (
  elements: any,
  elementsHistory: any,
  fixtures: any,
  teams: any,
  currentEvent: any,
  deltaEvent: number,
  picksData?: any,
  last5?: any
) => {
  try {
    let picksData1;
    if (!picksData) {
      picksData1 = {
        picks: elements.map((el: any) => {
          return { element: el.id };
        }),
      };
    } else {
      picksData1 = picksData;
    }
    let model: any = picksOptimizationModel(
      elements,
      elementsHistory,
      fixtures,
      teams,
      currentEvent,
      deltaEvent,
      picksData1,
      last5
    );
    if (!picksData) {
      model = wildcardOptimizationModel(
        elements,
        elementsHistory,
        fixtures,
        teams,
        currentEvent,
        deltaEvent,
        last5
      );
    }

    const solution2 = solve(model);
    if (!picksData) {
      picksData1 = {
        picks: solution2.variables.map((sol: any) => {
          return {
            element: elements.find((e: any) =>
              e.id == Number(sol[0].split("_")[1])
            ).id,
          };
        }),
      };
    }

    const benched = picksData
      ? picksData1.picks
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
              elementsHistory.find((eh: any) =>
                elements.find((el: any) => el.id == p.element).code == eh.code
              ),
              last5
            ),
          };
        })
        .filter(
          (p: any) =>
            !solution2.variables.map((v: any) => Number(v[0].split("_")[1]))
              .includes(p.element),
        )
      : [];

    const solutionAsObject: any[] = [
      ...solution2.variables.map((v: any, idx: number) => {
        return {
          element: elements.find((e: any) =>
            e.id == Number(v[0].split("_")[1])
          ).id,
          position: idx + 1,
          is_captain: false,
          is_vice_captain: false,
          multiplier: 1,
          xp: getExpectedPoints(
            elements.find((e: any) => e.id == Number(v[0].split("_")[1])),
            currentEvent.id,
            deltaEvent,
            fixtures,
            teams,
            elementsHistory.find((eh: any) =>
              elements.find((el: any) => el.id == Number(v[0].split("_")[1]))
                .code == eh.code
            ),
            last5
          ),
        };
      }),
      ...benched,
    ];

    const captaincySolution = solutionAsObject.toSorted((a: any, b: any) =>
      b.xp - a.xp
    ).slice(0, 2);

    const result = solutionAsObject.map((res: any, idx: number) => {
      return {
        ...res,
        web_name: elements.find((el: any) => el.id == res.element).web_name,
        position: idx + 1,
        multiplier: captaincySolution[0].element == res.element
          ? 2
          : res.multiplier,
        is_captain: captaincySolution[0].element == res.element ? true : false,
        is_vice_captain: captaincySolution[1].element == res.element
          ? true
          : false,
      };
    });

    console.log(result);

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
  elementsHistory: any,
  fixtures: any,
  teams: any,
  suffix: any,
  filterCat: any,
  addEntries: any,
  inputGw?: any,
  last5?: any
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

        const elementHist = elementsHistory.find((eh: any) => e.code == eh.code)

        let entries = Object.fromEntries([
          [`player_${e.id}`, 1],
          ...addEntries,
          ["fwd", e.element_type == 4 ? 1 : 0],
          ["mid", e.element_type == 3 ? 1 : 0],
          ["def", e.element_type == 2 ? 1 : 0],
          ["gkp", e.element_type == 1 ? 1 : 0],
          ["xp", getExpectedPoints(e, inputGw, 1, fixtures, teams, elementHist, last5)],
          ["xp_next_2", getExpectedPoints(e, inputGw, 2, fixtures, teams, elementHist, last5)],
          ["xp_next_3", getExpectedPoints(e, inputGw, 3, fixtures, teams, elementHist, last5)],
          [
            "xp_sigm_3",
            getExpectedPoints(e, inputGw, 1, fixtures, teams, elementHist, last5) +
            getExpectedPoints(e, inputGw, 2, fixtures, teams, elementHist, last5) +
            getExpectedPoints(e, inputGw, 3, fixtures, teams, elementHist, last5),
          ],
          [
            "surplus_point",
            e.event_points - getExpectedPoints(e, inputGw, 0, fixtures, teams, elementHist, last5),
          ],

          [`team_${e.team_code}`, 1],
          [`is_playing_next`, e.chance_of_playing_next_round || 0],
        ]);

        return {
          ...e,
          max_pick: 1,
          ...entries,
        };
      })
      .filter(filterCat)
      .map((e: any) => [`player_${e.id}`, e]),
  );


  export const getLocalStorageUsagePercentage = () => {
    // Step 1: Calculate the total size of data stored in localStorage
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += (localStorage.getItem(key)?.length || 0) + key.length;
      }
    }

    // Step 2: Define the maximum capacity of localStorage (in bytes)
    // The maximum capacity of localStorage is typically around 5MB (5 * 1024 * 1024 bytes)
    const maxCapacity = 5 * 1024 * 1024;

    // Step 3: Calculate the usage percentage
    const usagePercentage = (totalSize / maxCapacity) * 100;

    return usagePercentage;
  };
