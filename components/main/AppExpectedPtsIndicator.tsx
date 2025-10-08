"use client";
import {
    getExpectedPoints
} from "@/utils";
import { useEffect, useState } from "react";

const _Changes = (props: any) => {
    const { changes } = props;
    if (changes > 0) {
        return (<p className="text-[0.6rem] md:text-[0.7rem] bg-green-400 text-white py-[0.1em] px-[0.2em]">{changes > 0 ? '+' + changes : changes}&#37;</p>)
    } else if (changes < 0) {
        return (<p className="text-[0.6rem] md:text-[0.7rem] bg-red-400 text-white py-[0.1em] px-[0.2em]">{changes > 0 ? '+' + changes : changes}&#37;</p>)
    }

    return (
        <p className="text-[0.6rem] md:text-[0.7rem] bg-inherit">{changes > 0 ? '+' + changes : changes}&#37;</p>
    )
}
const StatItemExtraLow = (props: any) => {
    const { className, label, value, changes } = props;
    return (
        <div className="w-4 h-4 md:w-6 md:h-6 flex flex-col justify-center items-center bg-red-200 text-red-700 border-1 border-red-700">
        </div>
    )

};

const StatItemLow = (props: any) => {
    const { className, label, value, changes } = props;
    return (
        <div className="w-4 h-4 md:w-6 md:h-6 flex flex-col justify-center items-center bg-amber-200 text-amber-700 border-1 border-amber-700">
        </div>
    )
};

const StatItemMid = (props: any) => {
    const { className, label, value, changes } = props;
    return (
        <div className="w-4 h-4 md:w-6 md:h-6 flex flex-col justify-center items-center bg-yellow-200 text-yellow-700 border-1 border-yellow-700">
        </div>
    )
};

const StatItemHigh = (props: any) => {
    const { className, label, value, changes } = props;
    return (
        <div className="w-4 h-4 md:w-6 md:h-6 flex flex-col justify-center items-center bg-lime-200 text-lime-700 border-1 border-lime-700">
        </div>
    )
};

const StatItemExtraHigh = (props: any) => {
    const { className, label, value, changes } = props;
    return (
        <div className="w-4 h-4 md:w-6 md:h-6 flex flex-col justify-center items-center bg-lime-200 text-lime-700 border-1 border-lime-700">
        </div>
    )
};

const AppExpectedPtsIndicator = (props: any) => {
    const {
        element,
        elementHist,
        currentEvent,
        deltaEvent,
        fixtures,
        teams,
        multiplier,
        last5,
        customLabel // label override
    } = props;
    const [xPoints, setXPoints] = useState<number>(0);
    const [xPointsOvr, setXPointsOvr] = useState<number>(0);

    const [changes, setChanges] = useState<number>(0);

    useEffect(() => {
        setXPoints(
            getExpectedPoints(
                element,
                currentEvent.id,
                deltaEvent,
                fixtures,
                teams,
                elementHist,
                last5
            ),
        );
        setXPointsOvr(
            getExpectedPoints(
                element,
                currentEvent.id,
                deltaEvent,
                fixtures,
                teams,
                elementHist
            ),
        );

    }, [element, currentEvent.id, deltaEvent, fixtures, teams, elementHist, last5]);

    useEffect(() => {
        xPointsOvr ? setChanges((xPoints - xPointsOvr) * 100 / xPointsOvr) : setChanges(0);
    }, [xPoints, xPointsOvr]);

    if (xPoints < 2) {
        return (
            <StatItemExtraLow
                label={customLabel ?? `xP${currentEvent.id + deltaEvent}`}
                value={xPoints.toFixed(2)}
                changes={changes.toFixed(2)}
            />
        );
    } else if (xPoints < 3) {
        return (
            <StatItemLow
                label={customLabel ?? `xP${currentEvent.id + deltaEvent}`}
                value={xPoints.toFixed(2)}
                changes={changes.toFixed(2)}
            />
        );
    } else if (xPoints < 5) {
        return (
            <StatItemMid
                label={customLabel ?? `xP${currentEvent.id + deltaEvent}`}
                value={xPoints.toFixed(2)}
                changes={changes.toFixed(2)}
            />
        );
    } else if (xPoints < 10) {
        return (
            <StatItemHigh
                label={customLabel ?? `xP${currentEvent.id + deltaEvent}`}
                value={xPoints.toFixed(2)}
                changes={changes.toFixed(2)}
            />
        );
    }

    return (
        <StatItemExtraHigh
            label={customLabel ?? `xP${currentEvent.id + deltaEvent}`}
            value={xPoints.toFixed(2)}
            changes={changes.toFixed(2)}
        />
    );
};

export default AppExpectedPtsIndicator;
