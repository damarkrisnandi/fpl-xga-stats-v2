import type { XPoint } from "./xp";

export type PickData = {
    active_chip: string | null;
    automatic_subs: Array<{
        entry: number;
        element_in: number;
        element_out: number;
        event: number;
    }>;
    entry_history: {
        event: number;
        points: number;
        total_points: number;
        rank: number;
        rank_sort: number;
        overall_rank: number;
        percentile_rank: number;
        bank: number;
        value: number;
        event_transfers: number;
        event_transfers_cost: number;
        points_on_bench: number;
    };
    picks: Array<PlayerPicked>;
};

export type PlayerPicked = {
    element: number;
    position: number;
    multiplier: number;
    is_captain: boolean;
    is_vice_captain: boolean;
    element_type: number;

    web_name?: string;
    photo?: string;
    event_points?: number;
    nextFixtures?: {
        team: string;
        event: number;
        difficulty: number;
        teamId: number;
    }[];
} & XPoint;
