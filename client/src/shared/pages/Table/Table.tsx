import React, { forwardRef, useCallback, useEffect } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
  useRowSelect,
} from "react-table";
import { ITableProps } from "./ITableProps";

/**
 * Renders a table component with the provided columns and data.
 * @param {string} id - The unique identifier for the table.
 * @param {Array} columns - The columns to be displayed in the table.
 * @param {Array} defaultSortColumn - The default sort column.
 * @param {string} defaultSortDirection - The default sort direction.
 * @param {Array} data - The data to be displayed in the table.
 * @param {string} [hiddenColumn] - The column to be hidden in the table.
 * @param {string} noDataMessage - The message to be displayed when there are no data to be displayed.
 * @param {Array} sortableColumns - The initially sortable columns.
 * @param {string} tableClassName - The class name for the table.
 * @return {JSX.Element} The rendered table component.
 */

const Table = forwardRef(
  ({
    id = "data-table",
    columns,
    defaultSortColumn,
    defaultSortDirection = "desc",
    data,
    hiddenColumn,
    noDataMessage = "No data to display",
    sortableColumns = [],
    tableClassName = "",
    onSort,
    manualSortBy = false,
  }: ITableProps) => {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      prepareRow,
      state: { sortBy },
    } = useTable(
      {
        columns,
        data,
        hiddenColumn,
        sortableColumns,
        manualSortBy: manualSortBy,
        initialState: {
          hiddenColumns: [hiddenColumn ?? ""],  
          sortBy: columns.map((coulmn) => {
            return {
              desc: false,
              id: coulmn.accessor ? coulmn.accessor : "",
            };
          }),
        },
      },
      useGlobalFilter,
      useSortBy,
      usePagination,
      useRowSelect
    );

    /**
     * Returns a JSX.Element or undefined based on the values of the provided parameters.
     *
     * @param {boolean} isSorted - Indicates whether the result should be sorted.
     * @param {boolean | undefined} isSortedDesc - Indicates the sorting order if 'isSorted' is true. If undefined, the default sorting order is used.
     * @return {JSX.Element | undefined} - The JSX.Element representing the sorted direction or undefined if 'isSorted' is false.
     */
    const getSortedDirection = (
      isSorted: boolean,
      isSortedDesc: boolean | undefined
    ): JSX.Element | undefined => {
      if (isSorted) {
        return (
          <i
            className={
              isSortedDesc
                ? "fa-regular fa-arrow-down-wide-short ml-1"
                : "fa-regular fa-arrow-up-short-wide ml-1"
            }
          ></i>
        );
      } else {
        return (
          <i className="fa-regular fa-arrow-up-arrow-down inactive-sort"></i>
        );
      }
    };

    /**
     * Handles sorting by key when a keyboard event occurs on a table header cell element.
     * @param event - The keyboard event.
     * @param col - The column object.
     * @param isColumnsSortable - JSX element that determines if columns are sortable.
     */
    const handleSortByKey = useCallback(
      (
        event: React.KeyboardEvent<HTMLTableCellElement>,
        col: any,
        isColumnsSortable: JSX.Element | null | undefined
      ) => {
        if (isColumnsSortable && event.key === "Enter") {
          const headerProps = col?.getHeaderProps(col?.getSortByToggleProps());
          headerProps.onClick(event);
        }
      },
      []
    );

    useEffect(() => {
      onSort(sortBy);
    }, [onSort, sortBy]);

    return (
      <div
        data-testid={`${id ? `table-main-${id}` : "table-main"}`}
        className={`${tableClassName}`}
      >
        <table
          {...getTableProps()}
          className="table table-striped table-hover mt-1 mb-3"
        >
          <thead data-testid="table-head">
            {headerGroups.map((headerGroup, headerIndex) => (
              <tr
                {...headerGroup?.getHeaderGroupProps()}
                key={`header_${headerIndex.toString()}`}
              >
                {headerGroup?.headers.map((col, colIndex) => {
                  const isSorted = col?.isSorted;
                  const isSortedDesc = col?.isSortedDesc;
                  const isColumnsSortable = sortableColumns?.includes(col?.id)
                    ? getSortedDirection(isSorted, isSortedDesc)
                    : null;

                  return (
                    <th
                      className="dark-border-header"
                      {...(isColumnsSortable && {
                        ...col?.getHeaderProps(col?.getSortByToggleProps()),
                      })}
                      onKeyDown={(event) =>
                        handleSortByKey(event, col, isColumnsSortable)
                      }
                      key={`col_${colIndex.toString()}`}
                      style={{ width: `${col.width}px` }}
                      tabIndex={0}
                    >
                      {col?.render("Header")}
                      <span className="ml-1">{isColumnsSortable}</span>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody data-testid="table-body" {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row?.getRowProps()} key={row?.index}>
                  {row?.cells?.map((cell, cellIndex) => (
                    <td
                      {...cell?.getCellProps()}
                      style={{ width: `${cell.column.width}px` }}
                      className={
                        cellIndex === 0 &&
                        ((cell?.row?.original as any)?.isPayerIcon as boolean)
                          ? "left-border"
                          : ""
                      }
                      key={`cell_${cellIndex.toString()}`}
                    >
                      {cell?.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
            {page.length === 0 && (
              <tr className="odd">
                <td
                  valign="top"
                  colSpan={columns.length}
                  className="text-center"
                >
                  {noDataMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
);

Table.displayName = "Table";
export default Table;
