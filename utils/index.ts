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
  switch (code) {
    case 1:
      return "bg-green-700 text-white";
    case 2:
      return "bg-green-500 text-white";
    case 3:
      return "";
    case 4:
      return "bg-red-500 text-white";
    case 5:
      return "bg-red-900 text-white";
    default:
      return "";
  }
  return "";
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
  fixtures: any
) => {
  let gameWeek = currentGameWeek + deltaEvent;
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


  for (let fixture of filteredfixturesByGameweek) {
  
    if (element.team == fixture.team_h) {
      diffIndex = diffRef[fixture.team_h_difficulty];
    } else if (element.team == fixture.team_a) {
      diffIndex = diffRef[fixture.team_a_difficulty];
    }

    xP = xP * starts_per_90 * diffIndex;

    totalXP += xP;
  }

  return totalXP;
};
