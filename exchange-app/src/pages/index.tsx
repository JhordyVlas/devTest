import { useSocket } from "@/common/hooks";
import {
  Instrument,
  InstumentsTable,
  Order,
  OrdersTable,
} from "@/components/shared";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

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
