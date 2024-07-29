'use client';

import { useState, useEffect } from 'react';
import PlayerCard from './PlayerCard';
import expectedPoints from '@/services/expected_points';

interface Player {
  id: number;
  name: string;
}

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const [boostrap, setBootstrap] = useState<any>({})
  const [fixtures, setFixtures] = useState<any>([])
  const [history, setHistory] = useState<any>({})

  useEffect(() => {
    

    const fetchBootstrap = () => {
        fetch('https://fpl-fetch.netlify.app/api/bootstrap-static')
        .then(resp => resp.ok ? resp.json() : null)
        .then((response: any) => {
          if (response) {
            setBootstrap(response)
          }
        })
        
    }

    const fetchFixtures = () => {
        fetch('https://fpl-fetch.netlify.app/api/fixtures')
        .then(resp => resp.ok ? resp.json() : [])
        .then((response: any) => {
          setFixtures(response)  
        })
        
    }

    const fetchHistory = () => {
      fetch('https://fpl-static-data.vercel.app/2023-2024/bootstrap-static.json')
        .then(resp => resp.ok ? resp.json() : null)
        .then((response) => {
          setHistory(response)
        })
    }
    
    fetchBootstrap()
    fetchFixtures();
    fetchHistory();
  }, []);

  const convertTeam = (id: number): string => {
    return boostrap.teams.find((team: any) => team.id === id)?.short_name;
  }

  const convertTeamById = (id: number): string => {
    return boostrap.teams.find((team: any) => team.id === id)?.short_name;
  }

  const convertNextMatches = (team_id: number) => {
    return fixturesFilteredByTeam(team_id).map((fixture: any) => {
        if (team_id === fixture.team_a) {
            return convertTeamById(fixture.team_h) + ' (A)'
        } else {
            return convertTeamById(fixture.team_a) + ' (H)'
        }
    })
  }

  const convertNextMatchesDiff = (team_id: number) => {
    return fixturesFilteredByTeam(team_id).map((fixture: any) => {
        if (team_id === fixture.team_a) {
            return fixture.team_a_difficulty;
        } else {
            return fixture.team_h_difficulty;
        }
    })
  }

  const fixturesFilteredByTeam = (team_id: number) => {
    return fixtures.filter((fixture: any) => !fixture.finished_provisional && (team_id === fixture.team_a || team_id === fixture.team_h)).slice(0, 5);
  }

  return (
    <div className="flex justify-center">
      <div className='flex flex-wrap justify-center w-11/12 space-x-1 space-y-1'>
        {
            boostrap?.elements?.toSorted(
                (a: any, b: any) => expectedPoints(history?.elements, b) - expectedPoints(history?.elements, a)
            )
            .map((element: any) => (
                <PlayerCard 
                
                key={element.id}
                name={element.web_name} 
                firstLastName={`${element.first_name} ${element.second_name}`} 
                image={setUrlImgJpgToPng(element.photo)} 
                position={convertPosition(element.element_type)} 
                team={convertTeam(element.team)} 
                teamImg={setUrlImgTeamPng(element.team_code)}
                tsb={element.selected_by_percent} 
                price={(element.now_cost / 10).toFixed(1)} 
                nextMatches={convertNextMatches(element.team)} 
                nextMatchesDiff={convertNextMatchesDiff(element.team)}
                point={expectedPoints(history?.elements, element)}
                />
            
            ))
        }
      </div>
    </div>
  );
};

const setUrlImgJpgToPng = (photo: string): string => {
    return ('https://resources.premierleague.com/premierleague/photos/players/250x250/p' + photo).replace('.jpg', '.png')
}

const setUrlImgTeamPng = (id: number): string => {
  return `https://resources.premierleague.com/premierleague/badges/70/t${id}.png`
}

const convertPosition = (code: number): string => {
    switch (code) {
        case 1:
            return 'GK';
        case 2:
            return 'DEF';
        case 3:
            return 'MID';
        case 4:
            return 'FWD';
        default:
            return 'N/A';
    }

    return 'N/A'

}



export default PlayerList;
