import type {
  Bootstrap,
  Element,
  Event,
  Team
} from "@/models/bootstrap";
import type { Fixture } from "@/models/fixture";
import type { LiveEvent } from "@/models/live-event";
import type { PickData, PlayerPicked } from "@/models/picks";
import { solve } from "yalps";

// Types imported from models for better type safety

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

export const currentSeason = "2025-2026";
export const previousSeason = "2024-2025";

export function getPlayerPhotoUrl(photo: string): string {
  const imageId = photo?.split(".")[0] || "";
  return `https://resources.premierleague.com/premierleague/photos/players/250x250/p${imageId}.png`;
}

export function getTeamLogoUrl(id: number): string {
  return `https://resources.premierleague.com/premierleague/badges/70/t${id}.png`;
}

export const sectionClassName = "w-11/12 md:w-10/12 lg:w-7/12 mb-2";

export function difficultyColor(code: number): string {
  const classArr = [
    "",
    "bg-green-700 text-white",
    "bg-green-500 text-white",
    "",
    "bg-red-500 text-white",
    "bg-red-900 text-white",
  ];
  return classArr[code] || "";
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

const calculateBaseExpected = (element: Element, fixturesLen: number): number => {
  let xP = 0;
  const {
    element_type,
    expected_goals_per_90,
    expected_assists_per_90,
    starts_per_90,
    clean_sheets_per_90,
    own_goals,
    expected_goals_conceded_per_90,
    saves,
    minutes,
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

const calculateBaseExpectedLast5 = (
  baseEl: Element,
  stat5: LiveEvent[] | null | undefined
): number => {
  let xP5 = 0;
  let match = 0;

  if (!stat5) return 0;

  for (const live of stat5.filter((el: LiveEvent) =>
    el.elements?.find((e) => e.id === baseEl.id) ?? null
  )) {
    match++;
    let xP = 0;
    const { element_type } = baseEl;

    const stats = live.elements.find((el) => el.id === baseEl.id)?.stats;
    if (!stats) continue;

    const {
      own_goals,
      saves,
      minutes,
      yellow_cards,
      red_cards,
      goals_scored,
      assists,
      starts,
      expected_goals,
      expected_assists,
      expected_goals_conceded,
      clean_sheets,
    } = stats;

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
  element: Element,
  teamData: Team,
  opponentData: Team,
  isHome: boolean,
): number => {
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
        haIdxValue = (1 * (homeOff - awayDefOpp)) / awayOvrOpp;
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
        haIdxValue = (1 * (homeDef - awayOffOpp)) / awayOvrOpp;
        break;
      default:
        break;
    }
  } else {
    switch (element.element_type) {
      case 4:
        haIdxValue = (1 * (awayOff - homeDefOpp)) / homeOvrOpp;
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
        haIdxValue = (1 * (awayDef - homeOffOpp)) / homeOvrOpp;
        break;
      default:
        break;
    }
  }

  return haIdxValue;
};

export const getExpectedPoints = (
  element: Element,
  currentGameWeek: number,
  deltaEvent: number,
  fixtures: Fixture[],
  teams: Team[],
  elementHistory?: Element,
  last5?: LiveEvent[] | undefined | null
): number => {
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
    xP = calculateBaseExpectedLast5(element, last5);
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
      const teamH = teams.find((t: any) => t.id == fixture.team_h);
      const teamA = teams.find((t: any) => t.id == fixture.team_a);
      if (!teamH || !teamA) {
        continue;
      }
      diffIndex = diffRef[fixture.team_h_difficulty] +
        getHomeAwayIndex(
          element,
          teamH,
          teamA,
          true,
        );
    } else if (element.team == fixture.team_a) {
      if (deltaEvent < 0 && !fixture.finished) {
        return 0;
      }
      const teamA = teams.find((t: any) => t.id == fixture.team_a);
      const teamH = teams.find((t: any) => t.id == fixture.team_h);
      if (!teamA || !teamH) {
        continue;
      }
      diffIndex = diffRef[fixture.team_a_difficulty] +
        getHomeAwayIndex(
          element,
          teamA,
          teamH,
          false,
        );
    }

    xP = xP * element.starts_per_90 * diffIndex *
      elementStatusIndex[element.status];

    totalXP += xP;
  }

  return totalXP;
};

const wildcardOptimizationModel = (
  elements: Element[],
  elementsHistory: Element[],
  fixtures: Fixture[],
  teams: Team[],
  currentEvent: Event,
  deltaEvent: number,
  last5?: LiveEvent[]
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
    integers: Object.keys(fplInts),
  };
};

const picksOptimizationModel = (
  elements: Element[],
  elementsHistory: Element[],
  fixtures: Fixture[],
  teams: Team[],
  currentEvent: Event,
  deltaEvent: number,
  picksData?: PickData,
  last5?: LiveEvent[]
) => {
  elements.sort((a: any, b: any) => a.element_type - b.element_type);
  const elements1 = elements.filter((el: any) =>
    picksData && picksData.picks.map((a: any) => a.element).includes(el.id)
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
    integers: Object.keys(fplInts),
  };
};

export const optimizationProcess = ({
  bootstrap,
  bootstrapHistory,
  fixtures,
  // fixturesHistory,
  last5,
  picksData,
  deltaEvent
}: {
  bootstrap: Bootstrap,
  bootstrapHistory: Bootstrap,
  fixtures: Fixture[],
  // fixturesHistory: Fixture[],
  last5?: LiveEvent[],
  picksData?: PickData,
  deltaEvent: number
}
): PlayerPicked[] => {
  const currentEvent = bootstrap.events.find((e) => e.is_current) ?? bootstrap.events[0]

  try {
    let picksData1: PickData;
    if (!picksData) {
      picksData1 = {
        active_chip: null,
        automatic_subs: [],
        entry_history: {
          event: bootstrap.events.find((e) => e.is_current)?.id || 1,
          points: 0,
          total_points: 0,
          rank: 0,
          rank_sort: 0,
          overall_rank: 0,
          percentile_rank: 0,
          bank: 1000,
          value: 1000,
          event_transfers: 0,
          event_transfers_cost: 0,
          points_on_bench: 0,
        },
        picks: bootstrap.elements.map((el) => ({
          element: el.id,
          position: 1,
          multiplier: 1,
          is_captain: false,
          is_vice_captain: false,
          element_type: el.element_type,
        })),
      };
    } else {
      picksData1 = picksData;
    }
    let model: any = picksOptimizationModel(
      bootstrap.elements,
      bootstrapHistory.elements,
      fixtures,
      bootstrap.teams,
      currentEvent,
      deltaEvent,
      picksData1,
      last5
    );
    if (!picksData) {
      model = wildcardOptimizationModel(
        bootstrap.elements,
        bootstrapHistory.elements,
        fixtures,
        bootstrap.teams,
        currentEvent,
        deltaEvent,
        last5
      );
    }

    const solution2 = solve(model);
    if (!picksData) {
      picksData1 = {
        ...picksData1,
        picks: solution2.variables.map((sol) => {
          const elementId = Number(sol[0].split("_")[1]);
          const foundElement = bootstrap.elements.find((e) => e.id === elementId);
          if (!foundElement) {
            throw new Error(`Element with id ${elementId} not found`);
          }
          return {
            element: foundElement.id,
            position: 1,
            multiplier: 1,
            is_captain: false,
            is_vice_captain: false,
            element_type: foundElement.element_type,
          };
        }),
      };
    }

    const benched: PlayerPicked[] = picksData
      ? picksData1.picks
        .map((p) => {
          const foundElement = bootstrap.elements.find((el) => el.id === p.element);
          const foundElementHistory = bootstrapHistory.elements.find((eh) =>
            foundElement && foundElement.code === eh.code
          );
          if (!foundElement) {
            throw new Error(`Element with id ${p.element} not found`);
          }
          return {
            ...p,
            multiplier: 0,
            web_name: foundElement.web_name,
            xp: getExpectedPoints(
              foundElement,
              currentEvent.id,
              deltaEvent,
              fixtures,
              bootstrap.teams,
              foundElementHistory,
              last5
            ),
          };
        })
        .filter(
          (p) =>
            !solution2.variables.map((v) => Number(v[0].split("_")[1]))
              .includes(p.element),
        )
      : [];

    const solutionAsObject: PlayerPicked[] = [
      ...solution2.variables.map((v, idx) => {
        const elementId = Number(v[0].split("_")[1]);
        const foundElement = bootstrap.elements.find((e) => e.id === elementId);
        const foundElementHistory = bootstrapHistory.elements.find((eh) =>
          foundElement && foundElement.code === eh.code
        );
        if (!foundElement) {
          throw new Error(`Element with id ${elementId} not found`);
        }
        return {
          element: foundElement.id,
          position: idx + 1,
          is_captain: false,
          is_vice_captain: false,
          multiplier: 1,
          element_type: foundElement.element_type,
          xp: getExpectedPoints(
            foundElement,
            currentEvent.id,
            deltaEvent,
            fixtures,
            bootstrap.teams,
            foundElementHistory,
            last5
          ),
        };
      }),
      ...benched,
    ];

    const captaincySolution = solutionAsObject
      .toSorted((a, b) => (b.xp || 0) - (a.xp || 0))
      .slice(0, 2);

    const result = solutionAsObject.map((res, idx) => {
      const foundElement = bootstrap.elements.find((el) => el.id === res.element);
      if (!foundElement) {
        throw new Error(`Element with id ${res.element} not found`);
      }
      return {
        ...res,
        web_name: foundElement.web_name,
        position: idx + 1,
        multiplier: captaincySolution[0]?.element === res.element
          ? 2
          : res.multiplier,
        is_captain: captaincySolution[0]?.element === res.element,
        is_vice_captain: captaincySolution[1]?.element === res.element,
      };
    });


    return result;
  } catch (error) {
    console.error('Optimization process failed:', error);
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
  elements: Element[],
  elementsHistory: Element[],
  fixtures: Fixture[],
  teams: Team[],
  suffix: string,
  filterCat: (element: Element & Record<string, unknown>) => boolean,
  addEntries: Array<[string, unknown]>,
  inputGw?: number,
  last5?: LiveEvent[]
) =>
  Object.fromEntries(
    elements
      .map((e) => {
        const elementHist = elementsHistory.find((eh) => e.code === eh.code);

        const currentGameWeek = inputGw || 1;
        let entries = Object.fromEntries([
          [`player_${e.id}`, 1],
          ...addEntries,
          ["fwd", e.element_type === 4 ? 1 : 0],
          ["mid", e.element_type === 3 ? 1 : 0],
          ["def", e.element_type === 2 ? 1 : 0],
          ["gkp", e.element_type === 1 ? 1 : 0],
          ["xp", getExpectedPoints(e, currentGameWeek, 1, fixtures, teams, elementHist, last5)],
          ["xp_next_2", getExpectedPoints(e, currentGameWeek, 2, fixtures, teams, elementHist, last5)],
          ["xp_next_3", getExpectedPoints(e, currentGameWeek, 3, fixtures, teams, elementHist, last5)],
          [
            "xp_sigm_3",
            getExpectedPoints(e, currentGameWeek, 1, fixtures, teams, elementHist, last5) +
            getExpectedPoints(e, currentGameWeek, 2, fixtures, teams, elementHist, last5) +
            getExpectedPoints(e, currentGameWeek, 3, fixtures, teams, elementHist, last5),
          ],
          [
            "surplus_point",
            e.event_points - getExpectedPoints(e, currentGameWeek, 0, fixtures, teams, elementHist, last5),
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
