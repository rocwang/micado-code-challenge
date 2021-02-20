import { ChangeEvent, FC } from "react";
import { format } from "date-fns";
import { SetDate } from "./App";

export type Indicator = "numberOfCases" | "testsPerDay" | "totalTests";

export function indicatorsToSubSeries(indicators: Indicator[]) {
  return indicators.flatMap(
    (v) =>
      ({
        numberOfCases: ["Active", "Deceased", "Recovered"],
        testsPerDay: ["Tests by day"],
        totalTests: ["Total tests (cumulative)"],
      }[v])
  );
}

function onIndicatorChange(
  e: ChangeEvent<HTMLInputElement>,
  indicators: string[],
  setIndicators: Function
) {
  if (e.target.checked) {
    setIndicators([...new Set(indicators).add(e.target.name)]);
  } else {
    setIndicators(indicators.filter((value) => value !== e.target.name));
  }
}

const Control: FC<{
  className: string;
  indicators: string[];
  setIndicators: Function;
  from: Date | null;
  setFrom: SetDate;
  to: Date | null;
  setTo: SetDate;
}> = ({ className, indicators, setIndicators, from, setFrom, to, setTo }) => {
  return (
    <form className={className}>
      <label>
        <input
          name="numberOfCases"
          type="checkbox"
          checked={indicators.includes("numberOfCases")}
          onChange={(e) => onIndicatorChange(e, indicators, setIndicators)}
        />
        Number of Cases
      </label>

      <label>
        <input
          name="testsPerDay"
          type="checkbox"
          checked={indicators.includes("testsPerDay")}
          onChange={(e) => onIndicatorChange(e, indicators, setIndicators)}
        />
        Tests per day
      </label>

      <label>
        <input
          name="totalTests"
          type="checkbox"
          checked={indicators.includes("totalTests")}
          onChange={(e) => onIndicatorChange(e, indicators, setIndicators)}
        />
        Total tests (cumulative)
      </label>

      <div>
        <label htmlFor="from">From</label>
        <input
          type="date"
          id="from"
          value={from ? format(from, "yyy-MM-dd") : ""}
          onChange={(e) => setFrom(e.target.valueAsDate)}
        />
      </div>

      <div>
        <label htmlFor="to">To</label>
        <input
          type="date"
          id="to"
          value={to ? format(to, "yyy-MM-dd") : ""}
          onChange={(e) => setTo(e.target.valueAsDate)}
        />
      </div>
    </form>
  );
};

export default Control;
