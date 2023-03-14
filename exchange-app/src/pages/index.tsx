import { useSocket } from "@/common/hooks";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Toaster, toast } from "react-hot-toast";

export type Instrument = {
  symbol: string;
  state: string;
};

export type Order = {
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

  const saveSymbols = async () => {
    const input = instruments.map((value: Instrument) => {
      return {
        name: value.symbol,
        state: value.state,
      };
    });

    const res = await fetch("/api/symbols", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input.slice(0, 700)),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };

  const saveOrders = async () => {
    const input = orders.map(({ id, symbol, side }: Order) => {
      return {
        id,
        symbol,
        side,
      };
    });

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input.slice(0, 700)),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <main className="grid grid-cols-2 gap-3">
      <Toaster position="top-right" />
      <div className="col-span-2 flex w-full bg-white rounded-lg py-3 px-5 shadow justify-between items-center">
        <div>
          <h1 className="text-2xl">Orders & Symbols Table</h1>
          <p className="block text-gray-500 text-sm">
            To store the orders and symbols in the local storage press save
            button
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <button
            className="px-5 py-2 border-2 rounded-lg border-gray-200 hover:bg-gray-100"
            onClick={saveSymbols}
          >
            Save Symbols
          </button>
          <button
            className="px-5 py-2 border-2 rounded-lg border-gray-200 hover:bg-gray-100"
            onClick={saveOrders}
          >
            Save Orders
          </button>
        </div>
      </div>
      <InstumentsTable data={instruments} />
      <OrdersTable data={orders} />
    </main>
  );
}
