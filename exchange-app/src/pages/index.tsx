import { useSocket } from "@/common/hooks";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useReducer, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type Instrument = {
  symbol: string;
  state: string;
};

type Order = {
  id: string;
  symbol: string;
  side: string;
};

const InstumentsTable = ({ data }: { data: Instrument[] }) => {
  const colHelper = createColumnHelper<Instrument>();

  const columns = [
    colHelper.accessor("symbol", {
      header: "Symbol",
      cell: (info) => info.getValue(),
    }),
    colHelper.accessor("state", {
      header: "State",
      cell: (info) => info.getValue(),
    }),
  ];

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="table-container">
      <table className="table-auto">
        <caption>
          Symbols
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
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
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

const OrdersTable = ({ data }: { data: Order[] }) => {
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
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
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

export default function Home() {
  const [instruments, setInstruments] = useState([]);
  const [orders, setOrders] = useState([]);

  const { connected, socket } = useSocket(
    "wss://ws.bitmex.com/realtime?subscribe=instrument,orderBookL2_25:XBTUSD"
  );

  if (!connected) {
    return (
      <div className="flex justify-center items-center  text-xl lg:text-3xl">
        <span>Connecting to WebSocket...</span>
      </div>
    );
  }

  if (!socket) {
    return (
      <div className="flex justify-center items-center text-xl lg:text-3xl">
        <span className="text-red-600">
          An error ocurred initializing the instance, please try again later
        </span>
      </div>
    );
  }

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.table == "instrument" && message.action == "partial") {
      setInstruments(message.data);
    }

    if (message.table == "orderBookL2_25" && message.action == "partial") {
      setOrders(message.data);
    }
  };

  return (
    <main className="grid grid-cols-2 gap-3">
      <div>
        <InstumentsTable data={instruments} />
      </div>
      <div>
        <OrdersTable data={orders} />
      </div>
    </main>
  );
}
