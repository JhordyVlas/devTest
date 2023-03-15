import { useSocket } from "@/common/hooks";
import {
  Announcement,
  AnnouncementCard,
  Instrument,
  InstumentsTable,
  Order,
  OrdersTable,
} from "@/components/shared";
import { GetServerSideProps } from "next";
import { ScriptProps } from "next/script";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

interface Props extends ScriptProps {
  announcements: Announcement[];
}

export default function Home({ announcements }: Props) {
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

  const saveAnnouncements = async () => {
    const res = await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(announcements),
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
      <OrdersTable data={orders} />
      <InstumentsTable data={instruments} />
      <div className="col-span-2 flex w-full bg-white rounded-lg py-3 px-5 shadow justify-between items-center">
        <div>
          <h1 className="text-2xl">Announcements</h1>
          <p className="block text-gray-500 text-sm">
            To store the announcements in the local storage press save button
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <button
            className="px-5 py-2 border-2 rounded-lg border-gray-200 hover:bg-gray-100"
            onClick={saveAnnouncements}
          >
            Save
          </button>
        </div>
      </div>
      <div className="col-span-2">
        <div className="grid grid-cols-3 gap-3">
          {announcements.map((announcement, index) => (
            <AnnouncementCard {...announcement} key={index} />
          ))}
        </div>
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const result = await fetch("https://www.bitmex.com/api/v1/announcement");
  const announcements = await result.json();

  return {
    props: {
      announcements,
    },
  };
};
