'use client'
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

import { Button } from './ui/button';
import { Euro, MousePointer2, Percent } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';

interface PlayerCardProps {
  // Add props here, e.g. playerName: string;
  name?: string | any;
  firstLastName?: string;
  position?: string;
  team?: string;
  teamImg?:string;
  image?: string | any;
  tsb?: number | string;
  nextMatches?: string[];
  nextMatchesDiff: number[];
  price?: number | string;
  point?: number;

}

const PlayerCard: React.FC<PlayerCardProps> = (props) => {
    const convertColorDifficulty = (code: number) => {
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

    const convertColorPoint = (point: number | undefined): string => {
        if (point > 7) {
            return 'bg-green-500 text-white'
        } else if (point > 6) {
            return 'bg-green-200 text-green-700'
        } else if (point > 4) {
            return 'bg-lime-100 text-lime-700'
        } else if (point > 3) {
            return 'bg-yellow-100 text-orange-500'
        } else {
            return 'bg-red-100 text-red-600'
        }
        return '';
    }
  return (
    <Card className='w-11/12 md:w-1/4 lg:w-1/5 shadow-lg'>
        {/* <CardHeader>
            <CardTitle className='text-xl font-semibold'>{props.name}</CardTitle>
            <CardDescription>{props.firstLastName}</CardDescription>
        </CardHeader> */}
        <CardContent className='pt-5'>
            <div className="flex justify-between w-full items-center">
                <div className="flex items-center">
                    <Avatar>
                        <AvatarImage src={props.image} alt={props.name} />
                        {/* <AvatarFallback>CN</AvatarFallback> */}
                    </Avatar>
                    <Avatar>
                        <AvatarImage src={props.teamImg} alt={props.team} />
                        {/* <AvatarFallback>CN</AvatarFallback> */}
                    </Avatar>
                    <div className='p-2' >
                    <p className='text-xl font-semibold'>{props.name}</p>
                    <p className='text-sm text-gray-500'>{props.firstLastName}</p>
                </div>
                </div>
                
                

                <div className="flex">
                    <div className={`h-10 w-10 p-3 rounded-full flex justify-center items-center font-semibold text-xs ${convertColorPoint(props.point)}`}>
                        {props.point?.toFixed(2) || 0}
                    </div>
                </div>
            </div>
            <div className='flex justify-start items-center w-full'>
            <div className='w-full p-2 text-sm flex justify-center items-center'>{props.position}</div>
                <div className='w-full p-2 text-sm flex justify-center items-center'>£{props.price}</div>
                <div className='w-full p-2 text-sm flex justify-center items-center'><MousePointer2 className='p-1'/> {props.tsb}%</div>
            </div>
            <div className='flex items-center justify-between w-full'>
                {props.nextMatches?.map((match: string, index) => (
                    <div className={`w-full flex flex-col justify-center items-center p-2 text-xs ${convertColorDifficulty(props.nextMatchesDiff[index])}`} key={index}>
                        <p>{match.split(' ')[0]}</p>
                        <p>{match.split(' ')[1]}</p>
                    </div>
                ))}
            </div>
        </CardContent>
        {/* <CardFooter className='flex justify-center'>
            <div className='w-full'>
                
                <div className='mt-1'>
                    <Button className='w-full'>Show Detail</Button>
                </div>
            </div>
        </CardFooter> */}
      </Card>
  );
};

export default PlayerCard;