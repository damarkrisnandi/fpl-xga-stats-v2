'use client'
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'
import { getManagerData } from '@/services/index'

const AppInputMyTeam = (props: any) => {
    const [teamId, setTeamId] = useState<any>(null);
    const [manager, setManager] = useState<any>(null);
    useEffect(() => {

    })
    const handleOnChange = (event: any) => {
        setTeamId(event.target.value)
    }

    const handleOnSearch = (event: any) => {
        getManagerData(teamId).then((value) => setManager(value))
    }

    return (
        <div className="w-11/12 md:w-5/12">
            <div className="flex h-12 space-x-2">
                <Input type="text" placeholder="Input My Team" onChange={handleOnChange}/>
                <Button className="" disabled={!teamId || teamId.length == 0} onClick={handleOnSearch}><Search /></Button>
            </div>
            {
                manager && (
                <div className={`w-full h-28 md:w-full md:h-48 p-3 md:p-6 flex flex-col justify-center items-start bg-slate-200`}>
                    <p className="text-xs md:text-sm">ID: {manager.id}</p>
                    <p className="text-sm md:text-xl font-semibold">{manager.name}</p>
                    <p className="text-xs md:text-sm">{ manager.player_first_name } { manager.player_last_name}</p>
                    <div className="w-full flex justify-end">
                        <Button className="flex space-x-2 text-xs md:text-sm" disabled={!teamId || teamId.length == 0} onClick={handleOnSearch}>Find My Team</Button>
                    </div>
                </div>
                )
            }
        </div>
    )
}

export default AppInputMyTeam