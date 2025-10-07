"use client";
import {
  getExpectedPoints
} from "@/utils";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { SquareCard, SquareCardFooter, SquareCardLabel } from "../ui/square-card";

const Changes = (props: any) => {
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
    <SquareCard className={cn("bg-red-200 text-red-700", className)}>
      <SquareCardLabel>{label}</SquareCardLabel>
      <SquareCardLabel className="text-sm md:text-xl font-semibold">{value}</SquareCardLabel>
      <SquareCardFooter>
        <Changes changes={changes} />
      </SquareCardFooter>
    </SquareCard>
  );
};

const StatItemLow = (props: any) => {
  const { className, label, value, changes } = props;
  return (
    <SquareCard className={cn("bg-amber-200 text-amber-700", className)}>
      <SquareCardLabel>{label}</SquareCardLabel>
      <SquareCardLabel className="text-sm md:text-xl font-semibold">{value}</SquareCardLabel>
      <SquareCardFooter>
        <Changes changes={changes} />
      </SquareCardFooter>
    </SquareCard>

  );
};

const StatItemMid = (props: any) => {
  const { className, label, value, changes } = props;
  return (
    <SquareCard className={cn("bg-yellow-200 text-yellow-700", className)}>
      <SquareCardLabel>{label}</SquareCardLabel>
      <SquareCardLabel className="text-sm md:text-xl font-semibold">{value}</SquareCardLabel>
      <SquareCardFooter>
        <Changes changes={changes} />
      </SquareCardFooter>
    </SquareCard>
  );
};

const StatItemHigh = (props: any) => {
  const { className, label, value, changes } = props;
  return (
    <SquareCard className={cn("bg-lime-200 text-lime-700", className)}>
      <SquareCardLabel>{label}</SquareCardLabel>
      <SquareCardLabel className="text-sm md:text-xl font-semibold">{value}</SquareCardLabel>
      <SquareCardFooter>
        <Changes changes={changes} />
      </SquareCardFooter>
    </SquareCard>
  );
};

const StatItemExtraHigh = (props: any) => {
  const { className, label, value, changes } = props;
  return (
    <SquareCard className={cn("bg-lime-200 text-lime-700", className)}>
      <SquareCardLabel>{label}</SquareCardLabel>
      <SquareCardLabel className="text-sm md:text-xl font-semibold">{value}</SquareCardLabel>
      <SquareCardFooter>
        <Changes changes={changes} />
      </SquareCardFooter>
    </SquareCard>
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
    last5
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
        label={`xP${currentEvent.id + deltaEvent}`}
        value={xPoints.toFixed(2)}
        changes={changes.toFixed(2)}
      />
    );
  } else if (xPoints < 3) {
    return (
      <StatItemLow
        label={`xP${currentEvent.id + deltaEvent}`}
        value={xPoints.toFixed(2)}
        changes={changes.toFixed(2)}
      />
    );
  } else if (xPoints < 5) {
    return (
      <StatItemMid
        label={`xP${currentEvent.id + deltaEvent}`}
        value={xPoints.toFixed(2)}
        changes={changes.toFixed(2)}
      />
    );
  } else if (xPoints < 10) {
    return (
      <StatItemHigh
        label={`xP${currentEvent.id + deltaEvent}`}
        value={xPoints.toFixed(2)}
        changes={changes.toFixed(2)}
      />
    );
  }

  return (
    <StatItemExtraHigh
      label={`xP${currentEvent.id + deltaEvent}`}
      value={xPoints.toFixed(2)}
      changes={changes.toFixed(2)}
    />
  );
};

export default AppExpectedPts;
