import { FC, useMemo } from "react";
import { Row, useCovidData } from "./api";
import {
  ColumnInterface,
  CellProps,
  useFilters,
  usePagination,
  useTable,
} from "react-table";
import { Indicator, indicatorsToSubSeries } from "./Control";
import { equals, pipe } from "ramda";
import { parseJSON } from "date-fns";
import styles from "./Table.module.css";
import { format } from "date-fns/fp";

const Table: FC<{
  className: string;
  indicators: Indicator[];
  from: Date | null;
  to: Date | null;
}> = ({ className, indicators, from, to }) => {
  const { rows: data } = useCovidData();

  const cols: ColumnInterface[] = useMemo(
    () => [
      {
        Header: "Sub Series Name",
        accessor: "sub_series_name",
        filter: (rows, columnIds, filterValue: Indicator[]) => {
          const target = indicatorsToSubSeries(filterValue);
          return rows.filter((r) => target.has(r.values.sub_series_name));
        },
      },
      {
        Header: "Parameter",
        accessor: "parameter",
        filter: (rows, columnIds, [from, to]: Date[]) => {
          return rows.filter((r) => {
            const date = parseJSON(r.values.parameter);

            return from && date >= from && to && date <= to;
          });
        },
        Cell: ({ value }: CellProps<Row, string>) =>
          pipe(parseJSON, format("yyyy-MM-dd"))(value),
      },
      {
        Header: "Value",
        accessor: "value",
      },
    ],
    []
  );
  const tableInstance = useTable(
    {
      columns: cols as any,
      data: (data ?? []) as any,
      initialState: { pageSize: 50 },
    },
    useFilters,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    columns,
    // Instead of using 'rows', we'll use page, which has only the rows for the active page
    page,

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  const colSubSeriesName = columns.find((c) => c.id === "sub_series_name");
  if (colSubSeriesName && colSubSeriesName.filterValue !== indicators) {
    colSubSeriesName.setFilter(indicators);
  }

  const colParameter = columns.find((c) => c.id === "parameter");
  if (colParameter && !equals(colParameter.filterValue, [from, to])) {
    colParameter.setFilter([from, to]);
  }

  return (
    <div className={`${className} ${styles.root}`}>
      <div>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
