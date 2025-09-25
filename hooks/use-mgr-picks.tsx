import type { PickData } from '@/models/picks';
import { useCallback, useState } from 'react';

interface Manager {
    id: number;
    name: string;
    team_name: string;
    current_event: number;
}

interface UseMgrAndPicksReturn {
    manager: Manager | null;
    setManager: (manager: Manager | null) => void;
    picks: PickData | null;
    setPicks: (picks: PickData | null) => void;
}

const useMgrAndPicks = (): UseMgrAndPicksReturn => {
    const [manager, setManagerState] = useState<Manager | null>(null);
    const [picks, setPicksState] = useState<PickData | null>(null);

    const setManager = useCallback((newManager: Manager | null) => {
        setManagerState(newManager);
        if (newManager) {
            localStorage.setItem('manager_data', JSON.stringify(newManager));
        } else {
            localStorage.removeItem('manager_data');
        }
    }, []);

    const setPicks = useCallback((newPicks: PickData | null) => {
        setPicksState(newPicks);
        if (newPicks) {
            localStorage.setItem('picks_data', JSON.stringify(newPicks));
        } else {
            localStorage.removeItem('picks_data');
        }
    }, []);

    return {
        manager,
        setManager,
        picks,
        setPicks,
    };
};

export default useMgrAndPicks;
