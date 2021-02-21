import { ChangeEvent, FC } from "react";
import { format } from "date-fns";
import { SetDate, SetIndicators } from "./App";
import styles from "./Control.module.css";

export type Indicator = "numberOfCases" | "testsPerDay" | "totalTests";

export function indicatorsToSubSeries(indicators: Indicator[]): Set<string> {
  return new Set(
    indicators.flatMap(
      (v) =>
        ({
          numberOfCases: ["Active", "Deceased", "Recovered"],
          testsPerDay: ["Tests by day"],
          totalTests: ["Total tests (cumulative)"],
        }[v])
    )
  );
}

function onIndicatorChange(
  e: ChangeEvent<HTMLInputElement>,
  indicators: Indicator[],
  setIndicators: SetIndicators
) {
  if (e.target.checked) {
    setIndicators([...new Set(indicators).add(e.target.id as Indicator)]);
  } else {
    setIndicators(indicators.filter((value) => value !== e.target.id));
  }
}

const Control: FC<{
  className: string;
  indicators: Indicator[];
  setIndicators: SetIndicators;
  from: Date | null;
  setFrom: SetDate;
  to: Date | null;
  setTo: SetDate;
}> = ({ className, indicators, setIndicators, from, setFrom, to, setTo }) => {
  return (
    <form className={`${className} ${styles.root} border-bottom pb-3`}>
      <div className="mb-3">
        <div className="form-check form-check-inline form-switch">
          <input
            id="numberOfCases"
            type="checkbox"
            checked={indicators.includes("numberOfCases")}
            onChange={(e) => onIndicatorChange(e, indicators, setIndicators)}
            className="form-check-input"
          />
          <label className="form-check-label" htmlFor="numberOfCases">
            Number of Cases
          </label>
        </div>

        <div className="form-check form-check-inline form-switch">
          <input
            id="testsPerDay"
            type="checkbox"
            checked={indicators.includes("testsPerDay")}
            onChange={(e) => onIndicatorChange(e, indicators, setIndicators)}
            className="form-check-input"
          />
          <label className="form-check-label" htmlFor="testsPerDay">
            Tests per day
          </label>
        </div>

        <div className="form-check form-check-inline form-switch">
          <input
            id="totalTests"
            type="checkbox"
            checked={indicators.includes("totalTests")}
            onChange={(e) => onIndicatorChange(e, indicators, setIndicators)}
            className="form-check-input"
          />
          <label className="form-check-label" htmlFor="totalTests">
            Total tests (cumulative)
          </label>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="form-floating">
            <input
              type="date"
              id="from"
              value={from ? format(from, "yyy-MM-dd") : ""}
              onChange={(e) => setFrom(e.target.valueAsDate)}
              className="form-control"
            />
            <label htmlFor="from">From</label>
          </div>
        </div>
        <div className="col">
          <div className="form-floating">
            <input
              type="date"
              id="to"
              value={to ? format(to, "yyy-MM-dd") : ""}
              onChange={(e) => setTo(e.target.valueAsDate)}
              className="form-control"
            />
            <label htmlFor="to">To</label>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Control;
