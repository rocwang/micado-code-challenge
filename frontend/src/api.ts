import useSWR from "swr";

export interface Row {
  // id: number;
  // class: string;
  // category: string;
  // indicator_name: string;
  // series_name: string;
  sub_series_name: string;
  parameter: string;
  value: string;
  // units: string;
  // date_last_updated: string;
}

export function useDb(
  sql: string
): { rows: Row[] | undefined; isLoading: boolean; isError: any } {
  const { data, error } = useSWR<Row[], any>(sql, async (sql: string) => {
    const apiLocation =
      process.env.REACT_APP_API_LOCATION ??
      (await fetch("/api_location").then((res) => res.json()));

    return fetch(`${apiLocation}?${new URLSearchParams({ sql })}`).then((res) =>
      res.json()
    );
  });

  return {
    rows: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useCovidData() {
  return useDb(
    `select sub_series_name, parameter, value
     from covid_19_new_zealand
     where category = 'COVID-19'
       and indicator_name in ('Tests per day', 'Number of cases')
       and series_name in ('Tests by day', 'New Zealand', 'Total tests (cumulative)')
       and sub_series_name in ('Tests by day', 'Deceased', 'Active', 'Recovered', 'Total tests (cumulative)')
     order by parameter;
    `
  );
}
