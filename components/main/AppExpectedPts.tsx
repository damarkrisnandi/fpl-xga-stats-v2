"use client";
import { useEffect, useState } from "react";
import {
  difficultyColor,
  getExpectedPoints,
  getPlayerPhotoUrl,
  getTeamLogoUrl,
  positionMapping,
  xPColor,
} from "@/utils";

const StatItemExtraLow = (props: any) => {
  const { className, label, value } = props;
  return (
    <div
      className={`w-14 h-14 md:w-24 md:h-24 p-1 md:p-3 flex flex-col justify-center items-center  bg-red-200 text-red-700`}
    >
      <p className="text-xs md:text-sm">{label}</p>
      <p className="text-sm md:text-xl font-semibold">{value}</p>
    </div>
  );
};

const StatItemLow = (props: any) => {
  const { className, label, value } = props;
  return (
    <div
      className={`w-14 h-14 md:w-24 md:h-24 p-1 md:p-3 flex flex-col justify-center items-center bg-amber-200 text-amber-700`}
    >
      <p className="text-xs md:text-sm">{label}</p>
      <p className="text-sm md:text-xl font-semibold">{value}</p>
    </div>
  );
};

const StatItemMid = (props: any) => {
  const { className, label, value } = props;
  return (
    <div
      className={`w-14 h-14 md:w-24 md:h-24 p-1 md:p-3 flex flex-col justify-center items-center bg-yellow-200 text-yellow-700`}
    >
      <p className="text-xs md:text-sm">{label}</p>
      <p className="text-sm md:text-xl font-semibold">{value}</p>
    </div>
  );
};

const StatItemHigh = (props: any) => {
  const { className, label, value } = props;
  return (
    <div
      className={`w-14 h-14 md:w-24 md:h-24 p-1 md:p-3 flex flex-col justify-center items-center bg-lime-200 text-lime-700`}
    >
      <p className="text-xs md:text-sm">{label}</p>
      <p className="text-sm md:text-xl font-semibold">{value}</p>
    </div>
  );
};

const StatItemExtraHigh = (props: any) => {
  const { className, label, value } = props;
  return (
    <div
      className={`w-14 h-14 md:w-24 md:h-24 p-1 md:p-3 flex flex-col justify-center items-center bg-green-200 text-green-700`}
    >
      <p className="text-xs md:text-sm">{label}</p>
      <p className="text-sm md:text-xl font-semibold">{value}</p>
    </div>
  );
};

const AppExpectedPts = (props: any) => {
  const {
    element,
    elementHist,
    currentEvent,
    deltaEvent,
    fixtures,
    teams,
    multiplier,
  } = props;
  const [xPoints, setXPoints] = useState<any>(0);

  useEffect(() => {
    setXPoints(
      getExpectedPoints(
        element,
        currentEvent.id,
        deltaEvent,
        fixtures,
        teams,
        elementHist,
      ),
    );
  }, [element, currentEvent.id, deltaEvent, fixtures, teams, elementHist]);

  if (xPoints < 2) {
    return (
      <StatItemExtraLow
        label={`xP${currentEvent.id + deltaEvent + 1}`}
        value={xPoints.toFixed(2)}
      />
    );
  } else if (xPoints < 3) {
    return (
      <StatItemLow
        label={`xP${currentEvent.id + deltaEvent + 1}`}
        value={xPoints.toFixed(2)}
      />
    );
  } else if (xPoints < 5) {
    return (
      <StatItemMid
        label={`xP${currentEvent.id + deltaEvent + 1}`}
        value={xPoints.toFixed(2)}
      />
    );
  } else if (xPoints < 10) {
    return (
      <StatItemHigh
        label={`xP${currentEvent.id + deltaEvent + 1}`}
        value={xPoints.toFixed(2)}
      />
    );
  }

  return (
    <StatItemExtraHigh
      label={`xP${currentEvent.id + deltaEvent + 1}`}
      value={xPoints.toFixed(2)}
    />
  );
};

export default AppExpectedPts;
