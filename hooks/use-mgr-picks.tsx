'use client'

import type { PickData } from '@/models/picks';
import { getManagerData, getPicksData } from '@/services';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface Manager {
    id: number;
    name: string;
    team_name: string;
    current_event: number;
    player_first_name: string;
    player_last_name: string;
    summary_overall_points: number;
    summary_overall_rank: number;
    summary_event_points: number;
    summary_event_rank: number;
    current_event_rank: number;
    last_deadline_bank: number;
    last_deadline_value: number;
    last_deadline_total_transfers: number;
}

interface UseMgrAndPicksReturn {
    manager: Manager | null;
    isLoadingManager: boolean;
    errorManager: any;
    picks: PickData | null;
    isLoadingPicks: boolean;
    errorPicks: any;
    refetchManager: () => void;
    refetchPicks: () => void;
}

const useMgrAndPicks = (currentEvent?: any): UseMgrAndPicksReturn => {
    const [managerId, setManagerId] = useState<string | null>(null);

    // Get manager ID from localStorage on mount
    useEffect(() => {
        const storedId = localStorage.getItem('manager_id_stored');
        setManagerId(storedId);
    }, []);

    // Fetch manager data using React Query
    const {
        data: manager,
        isLoading: isLoadingManager,
        error: errorManager,
        refetch: refetchManager
    } = useQuery({
        queryKey: ['manager', managerId],
        queryFn: async () => await getManagerData(managerId || 0),
        enabled: !!managerId
    });

    // Fetch picks data using React Query
    const {
        data: picks,
        isLoading: isLoadingPicks,
        error: errorPicks,
        refetch: refetchPicks
    } = useQuery({
        queryKey: ['picks', managerId, currentEvent?.id],
        queryFn: async () => await getPicksData(managerId || 0, currentEvent?.id || 1),
        enabled: !!managerId && !!currentEvent?.id
    });

    return {
        manager: manager || null,
        isLoadingManager,
        errorManager,
        picks: picks || null,
        isLoadingPicks,
        errorPicks,
        refetchManager,
        refetchPicks,
    };
};

export default useMgrAndPicks;
