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

export const currentSeason = "2024-2025";

export function getPlayerPhotoUrl(photo: string): string {
  const imageId = photo?.split(".")[0] || "";
  return `https://resources.premierleague.com/premierleague/photos/players/250x250/p${imageId}.png`;
}

export function getTeamLogoUrl(id: number): string {
  return `https://resources.premierleague.com/premierleague/badges/70/t${id}.png`
}
