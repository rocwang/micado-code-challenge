import { Dispatch, FC, SetStateAction, useState } from "react";
import styles from "./App.module.css";
import Chart from "./Chart";
import Table from "./Table";
import Control, { Indicator } from "./Control";

export type SetIndicators = Dispatch<SetStateAction<Indicator[]>>;
export type SetDate = Dispatch<SetStateAction<Date | null>>;

const App: FC = () => {
  const [indicators, setIndicators] = useState<Indicator[]>([
    "numberOfCases",
    "testsPerDay",
    "totalTests",
  ]);
  const [from, setFrom] = useState<Date | null>(new Date("2020-01-01"));
  const [to, setTo] = useState<Date | null>(new Date("2021-12-31"));

  return (
    <div className={styles.root}>
      <Control
        className={styles.control}
        indicators={indicators}
        setIndicators={setIndicators}
        from={from}
        setFrom={setFrom}
        to={to}
        setTo={setTo}
      />
      <Table
        className={styles.table}
        indicators={indicators}
        from={from}
        to={to}
      />
      <Chart
        className={styles.chart}
        indicators={indicators}
        from={from}
        setFrom={setFrom}
        to={to}
        setTo={setTo}
      />
    </div>
  );
};

export default App;
