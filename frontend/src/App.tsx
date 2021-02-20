import { FC } from "react";
import ReactECharts from "echarts-for-react";
import "./App.css";
import useSWR from "swr";
import { EChartsOption } from "echarts/index";

interface Row {
  id: number;
  class: string;
  category: string;
  indicator_name: string;
  series_name: string;
  sub_series_name: string;
  parameter: string;
  value: string;
  units: string;
  date_last_updated: string;
}

function useDb(
  sql: string
): { rows: Row[] | undefined; isLoading: boolean; isError: any } {
  const { data, error } = useSWR<Row[], any>(sql, (sql: string) =>
    fetch("http://localhost:3080?" + new URLSearchParams({ sql })).then((res) =>
      res.json()
    )
  );

  return {
    rows: data,
    isLoading: !error && !data,
    isError: error,
  };
}

const App: FC = () => {
  const { rows, isLoading, isError } = useDb(
    `select sub_series_name, parameter, value
     from covid_19_new_zealand
     where category = 'COVID-19'
       and indicator_name in ('Tests per day', 'Number of cases')
       and series_name in ('Tests by day', 'New Zealand', 'Total tests (cumulative)')
       and sub_series_name in ('Tests by day', 'Deceased', 'Active', 'Recovered', 'Total tests (cumulative)')
     order by parameter;
    `
  );

  const options: EChartsOption = {
    title: {
      text: "COVID-19 cases in New Zealand (cumulative)",
      left: 0,
    },
    legend: { type: "plain" },
    dataset: [
      {
        dimensions: [
          { name: "parameter", type: "time" },
          { name: "value", type: "number" },
          { name: "sub_series_name", type: "ordinal" },
        ],
        source: isLoading ? [] : rows,
      },
      {
        transform: {
          type: "filter",
          config: { dimension: "sub_series_name", value: "Active" },
        },
      },
      {
        transform: {
          type: "filter",
          config: { dimension: "sub_series_name", value: "Deceased" },
        },
      },
      {
        transform: {
          type: "filter",
          config: { dimension: "sub_series_name", value: "Recovered" },
        },
      },
      {
        transform: {
          type: "filter",
          config: { dimension: "sub_series_name", value: "Tests by day" },
        },
      },
      {
        transform: {
          type: "filter",
          config: {
            dimension: "sub_series_name",
            value: "Total tests (cumulative)",
          },
        },
      },
    ],
    grid: { left: 15, right: 60, containLabel: true },
    xAxis: {
      name: "Date",
      type: "time",
    },
    yAxis: {
      name: "Number of Cases",
      type: "value",
      max: (value) => Math.round(value.max * 1.2),
    },
    series: [
      {
        name: "Recovered Cases",
        type: "line",
        stack: "cumulative",
        symbol: "none",
        itemStyle: { color: "#91cc75" },
        areaStyle: {},
        emphasis: {
          focus: "series",
        },
        encode: { x: "parameter", y: "value" },
        datasetIndex: 3,
      },
      {
        name: "Active Cases",
        type: "line",
        stack: "cumulative",
        symbol: "none",
        itemStyle: { color: "#ee6666" },
        areaStyle: {},
        emphasis: {
          focus: "series",
        },
        encode: { x: "parameter", y: "value" },
        datasetIndex: 1,
      },
      {
        name: "Deceased Cases",
        type: "line",
        stack: "cumulative",
        symbol: "none",
        itemStyle: { color: "#9a60b4" },
        areaStyle: {},
        emphasis: {
          focus: "series",
        },
        encode: { x: "parameter", y: "value" },
        datasetIndex: 2,
      },
      {
        name: "Tests by day",
        type: "line",
        symbol: "none",
        itemStyle: { color: "#3ba272" },
        emphasis: {},
        encode: { x: "parameter", y: "value" },
        datasetIndex: 4,
      },
      // {
      //   name: "Total tests (cumulative)",
      //   type: "line",
      //   itemStyle: { color: "#73c0de" },
      //   emphasis: {
      //     focus: "series",
      //   },
      //   encode: { x: "parameter", y: "value" },
      //   datasetIndex: 5,
      // },
    ],
    tooltip: {
      trigger: "axis",
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
        restore: {},
        saveAsImage: {},
      },
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
        minValueSpan: 3600 * 24 * 7000,
      },
      {
        type: "slider",
        start: 0,
        end: 100,
      },
    ],
  };

  return (
    <ReactECharts
      showLoading={isLoading}
      option={options}
      style={{ height: "100vh" }}
    />
  );
};

export default App;
