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
      name: 'Main',
      current: true,
      children: [
          {
              name: 'Home',
              id: ''
          },
          {
              name: 'Live Event',
              id: 'live-event',
          },
      ]
  },
];

export const currentSeason = "2024-2025";

export function getPlayerPhotoUrl(photo: string): string {
  const imageId = photo?.split(".")[0] || "";
  return `https://resources.premierleague.com/premierleague/photos/players/250x250/p${imageId}.png`;
}

export function getTeamLogoUrl(id: number): string {
  return `https://resources.premierleague.com/premierleague/badges/70/t${id}.png`
}

export function difficultyBgColor(code: number): string {
        switch (code) {
            case 1:
                return 'bg-green-500 text-white'
            case 2:
                return 'bg-green-500 text-white'
            case 3:
                return 'bg-gray-200'
            case 4:
                return 'bg-red-500 text-white'
            case 5:
                return 'bg-red-900 text-white'
            default:
                return '';
        }
        return '';
}

export function positionMapping(code: number): string {
    const position: any = {    
        1:'GKP',
        2: 'DEF',
        3: 'MID',
        4: 'FWD'
    }

    return position[code] || '';
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
        bps: "BPS"
    };
    return stats[code] || '';
}