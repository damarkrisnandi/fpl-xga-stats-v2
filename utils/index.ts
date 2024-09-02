export const leaguesData = [
  // {
  //     name: 'FPLMGM#5',
  //     current: true,
  //     children: [
  //         {
  //             name: 'Home',
  //             id: ''
  //         },
  //         {
  //             name: 'League A',
  //             id: '815990',
  //             league: true,
  //             showRelegationZone: true,
  //             showPromotionZone: false
  //         },
  //         {
  //             name: 'League B',
  //             id: '816007',
  //             league: true,
  //             showRelegationZone: false,
  //             showPromotionZone: true
  //         },
  //         {
  //             name: 'League S',
  //             id: '815963',
  //             league: true,
  //             showRelegationZone: false,
  //             showPromotionZone: false
  //         }
  //     ]
  // },
  // {
  //     name: 'FPLMGM#4',
  //     children: [
  //         {
  //             name: 'Summary',
  //             id: '2023-2024'
  //         },
  //         {
  //             name: 'League A',
  //             id: '2023-2024/league-a'
  //         },
  //         {
  //             name: 'League B',
  //             id: '2023-2024/league-b'
  //         },
  //         {
  //             name: 'Super League',
  //             id: '2023-2024/super-league'
  //         }
  //     ]
  // },
  // {
  //     name: 'FPLMGM#3',
  //     children: [
  //         {
  //             name: 'Data Not Found',
  //             id: '',
  //             disabled: true,
  //         }
  //     ]
  // },
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
    ],
  },
];

export const currentSeason = "2024-2025";

export function getPlayerPhotoUrl(photo: string): string {
  const imageId = photo?.split(".")[0] || "";
  return `https://resources.premierleague.com/premierleague/photos/players/250x250/p${imageId}.png`;
}

export function getTeamLogoUrl(id: number): string {
  return `https://resources.premierleague.com/premierleague/badges/70/t${id}.png`;
}

export function difficultyColor(code: number): string {
  let className = '';
  const classArr = [
    '',
    "bg-green-700 text-white",
    "bg-green-500 text-white",
    '',
    "bg-red-500 text-white",
    "bg-red-900 text-white"
  ]
  switch (code) {
    case 1:
      className = "bg-green-700 text-white";
      break;
    case 2:
      className = "bg-green-500 text-white";
      break;
    case 3:
      break
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
  if (value < 3) { return 'text-red-700' }
  else if (value < 4) { return 'text-yellow-500' }
  else if (value < 6) { return 'text-lime-700' }
  else if (value < 9) { return 'text-green-600' }
  
  return 'text-green-700' 
  
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
    own_goals: "OG",
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

export const getExpectedPoints = (
  element: any,
  currentGameWeek: number,
  deltaEvent: number,
  fixtures: any,
  teams: any
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
      fix.event <= (gameWeek)
  );

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
  } = element;
  if (element_type === 4) {
    const xPG = expected_goals_per_90 * 4;
    const xPA = expected_assists_per_90 * 3;
    const pMP = starts_per_90 >= 0.67 ? 2 : starts_per_90 == 0 ? 0 : 1;
    const xOG = (own_goals / filteredFixtures.length) * -1;
    xP = xPG + xPA + pMP + bonus / filteredFixtures.length + xOG;
  }
  if (element_type === 3) {
    const xPG = expected_goals_per_90 * 5;
    const xPA = expected_assists_per_90 * 3;
    const xCS = clean_sheets_per_90 * 1;
    const pMP = starts_per_90 >= 0.67 ? 2 : starts_per_90 == 0 ? 0 : 1;
    const xOG = (own_goals / filteredFixtures.length) * -1;
    xP = xPG + xPA + xCS + pMP + bonus / filteredFixtures.length + xOG;
  }
  if (element_type === 2) {
    const xPG = expected_goals_per_90 * 6;
    const xPA = expected_assists_per_90 * 3;
    const xCS = starts_per_90 >= 0.67 ? clean_sheets_per_90 * 4 : 0;
    const pMP = starts_per_90 >= 0.67 ? 2 : starts_per_90 == 0 ? 0 : 1;
    const xOG = (own_goals / filteredFixtures.length) * -1;
    const xGC = Math.floor(expected_goals_conceded_per_90/2);
    xP = xPG + xPA + xCS + pMP + bonus / filteredFixtures.length + xOG + xGC;
  }

  if (element_type === 1) {
    const xPG = expected_goals_per_90 * 6;
    const xPA = expected_assists_per_90 * 3;
    const xCS = starts_per_90 >= 0.67 ? clean_sheets_per_90 * 5 : 0;
    const pMP = starts_per_90 >= 0.67 ? 2 : starts_per_90 == 0 ? 0 : 1;
    const xOG = (own_goals / filteredFixtures.length) * -1;
    const xGC = Math.floor(expected_goals_conceded_per_90 / 2);
    const xSaves = Math.floor((saves / filteredFixtures.length) / 3)
    xP = xPG + xPA + xCS + pMP + bonus / filteredFixtures.length + xOG + xGC + xSaves;
  }

  const elementStatusIndex: any = {
    "a": 1,
    "d": (element.chance_of_playing_next_round / 100), 
    "i": (element.chance_of_playing_next_round / 100),
    "u": 0
  }

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
    fix.event == gameWeek && (element.team == fix.team_h || element.team == fix.team_a)
      
  );
  let totalXP = 0;

  const getTeamDataByCode = (code: number) => teams.find((team: any) => team.code == code);
  const getHomeAwayIndex = (element: any, teamData: any, opponentData: any, isHome: boolean) => {
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
          haIdxValue = ((1 * (homeOff - awayDefOpp)/ awayOvrOpp) + (0 * (homeDef - awayOffOpp) / awayOvrOpp))
          break;
        case 3:
          haIdxValue = (((8/9) * (homeOff - awayDefOpp) / awayOvrOpp) + ((1/9) * (homeDef - awayOffOpp) / awayOvrOpp))
          break;
        case 2:
          haIdxValue = (((9/15) * (homeOff - awayDefOpp) / awayOvrOpp) + ((6/15) * (homeDef - awayOffOpp) / awayOvrOpp))
          break;
        case 1:
          haIdxValue = ((0 * (homeOff - awayDefOpp) / awayOvrOpp) + (1 * (homeDef - awayOffOpp) / awayOvrOpp))
          break;      
        default:
          break;
      }
    } else {
      switch (element.element_type) {
        case 4:
          haIdxValue = ((1 * (awayOff - homeDefOpp)/ homeOvrOpp) + (0 * (awayDef - homeOffOpp) / homeOvrOpp))
          break;
        case 3:
          haIdxValue = (((8/9) * (awayOff - homeDefOpp) / homeOvrOpp) + ((1/9) * (awayDef - homeOffOpp) / homeOvrOpp))
          break;
        case 2:
          haIdxValue = (((9/15) * (awayOff - homeDefOpp) / homeOvrOpp) + ((6/15) * (awayDef - homeOffOpp) / homeOvrOpp))
          break;
        case 1:
          haIdxValue = ((0 * (awayOff - homeDefOpp) / homeOvrOpp) + (1 * (awayDef - homeOffOpp) / homeOvrOpp))
          break;      
        default:
          break;
      }

    }

    return haIdxValue
  }

  for (let fixture of filteredfixturesByGameweek) {
  
    if (element.team == fixture.team_h) {
      diffIndex = diffRef[fixture.team_h_difficulty] + getHomeAwayIndex(element, teams.find((t: any) => t.id == fixture.team_h), teams.find((t: any) => t.id == fixture.team_a), true);
    } else if (element.team == fixture.team_a) {
      diffIndex = diffRef[fixture.team_a_difficulty] + getHomeAwayIndex(element, teams.find((t: any) => t.id == fixture.team_a), teams.find((t: any) => t.id == fixture.team_h), false);
    }

    xP = xP * starts_per_90 * diffIndex * elementStatusIndex[element.status];

    totalXP += xP;
  }

  return totalXP;
};
