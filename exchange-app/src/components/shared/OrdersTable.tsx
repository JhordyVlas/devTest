import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TableFilter } from "./TableFilter";

export type Order = {
  id: string;
  symbol: string;
  side: string;
};

export const OrdersTable = ({
  data,
  filter = false,
}: {
  data: Order[];
  filter?: boolean;
}) => {
  const colHelper = createColumnHelper<Order>();

  const columns = [
    colHelper.accessor("id", {
      header: "Id",
      cell: (info) => info.getValue(),
    }),
    colHelper.accessor("symbol", {
      header: "Symbol",
      cell: (info) => info.getValue(),
    }),
    colHelper.accessor("side", {
      header: "Side",
      cell: (info) => info.getValue(),
    }),
  ];

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="table-container">
      <table className="table-auto">
        <caption>
          Orders
          <p className="description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores
            velit dolore, fuga rerum aperiam reprehenderit ut
          </p>
        </caption>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
                    <div>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {filter && header.column.getCanFilter() ? (
                        <div>
                          <TableFilter column={header.column} table={table} />
                        </div>
                      ) : null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-container">
        <div className="flex items-center space-x-2">
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border p-1 rounded w-16"
            />
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-5" />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
