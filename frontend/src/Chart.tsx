import { FC } from "react";
import ReactECharts, { EChartsInstance } from "echarts-for-react";
import { EChartsOption } from "echarts";
import { useCovidData } from "./api";
import { Indicator, indicatorsToSubSeries } from "./Control";
import { debounce } from "lodash-es";
import { SetDate } from "./App";

const Chart: FC<{
  className: string;
  indicators: Indicator[];
  from: Date | null;
  setFrom: SetDate;
  to: Date | null;
  setTo: SetDate;
}> = ({ className, indicators, from, setFrom, to, setTo }) => {
  const { rows, isLoading } = useCovidData();
  const seriesFilter = indicatorsToSubSeries(indicators);
  const series = [
    {
      name: "Recovered",
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
      name: "Active",
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
      name: "Deceased",
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
    {
      name: "Total tests (cumulative)",
      type: "line",
      symbol: "none",
      itemStyle: { color: "#73c0de" },
      emphasis: {},
      encode: { x: "parameter", y: "value" },
      datasetIndex: 5,
    },
  ].filter((s) => seriesFilter.has(s.name)) as any[];

  const options: EChartsOption = {
    title: {
      text: "New Zealand COVID-19 Statistic",
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
    series,
    tooltip: {
      trigger: "axis",
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: false,
        },
        restore: {},
        saveAsImage: {},
      },
    },
    dataZoom: [
      {
        type: "inside",
        startValue: from ? from.valueOf() : undefined,
        endValue: to ? to.valueOf() : undefined,
        minValueSpan: 3600 * 24 * 7000,
      },
      {
        type: "slider",
      },
    ],
  };

  const setFromTo = debounce((from: Date, to: Date) => {
    setFrom(from);
    setTo(to);
  }, 500);

  const onDataZoom = (
    e: {
      type: "datazoom";
      start: number;
      end: number;
      startValue?: number;
      endValue?: number;
    },
    instance: EChartsInstance
  ) => {
    const from = new Date(instance.getOption().dataZoom[0].startValue);
    const to = new Date(instance.getOption().dataZoom[0].endValue);
    setFromTo(from, to);
  };

  return (
    <ReactECharts
      className={className}
      showLoading={isLoading}
      notMerge={true}
      option={options}
      style={{ height: "100vh" }}
      onEvents={{
        datazoom: onDataZoom,
      }}
    />
  );
};

export default Chart;
