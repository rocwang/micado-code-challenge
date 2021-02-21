import { FC, useEffect, useMemo } from "react";
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
import { useWindowSize } from "react-use";

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
        Header: "Indicator",
        accessor: "sub_series_name",
        filter: (rows, columnIds, filterValue: Indicator[]) => {
          const target = indicatorsToSubSeries(filterValue);
          return rows.filter((r) => target.has(r.values.sub_series_name));
        },
      },
      {
        Header: "Date",
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

  const { height: windowHeight } = useWindowSize();
  const currentPageSize = Math.floor((windowHeight - 280) / 33);

  const tableInstance = useTable(
    {
      columns: cols as any,
      data: (data ?? []) as any,
      initialState: { pageSize: currentPageSize },
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

  if (pageSize !== currentPageSize) {
    setPageSize(currentPageSize);
  }

  return (
    <div className={`${className} ${styles.root}`}>
      <table
        {...getTableProps()}
        className="table table-striped table-hover table-bordered table-sm"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} scope="col">
                  {column.render("Header")}
                </th>
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

      <form className="row row-cols-auto align-items-center g-3">
        <div className="col flex-grow-1">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </div>
        <div className="col">
          <div className="btn-group" role="group" aria-label="pagination">
            <button
              type="button"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              className="btn btn-primary"
            >
              {"<<"}
            </button>
            <button
              type="button"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="btn btn-primary"
            >
              {"<"}
            </button>
            <button
              type="button"
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="btn btn-primary"
            >
              {">"}
            </button>
            <button
              type="button"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              className="btn btn-primary"
            >
              {">>"}
            </button>
          </div>
        </div>
        <div className={`col ${styles.goToPage}`}>
          <div className="input-group">
            <span className="input-group-text" id="gotoPage">
              Go to page
            </span>
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              className="form-control"
              aria-describedby="gotoPage"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Table;
