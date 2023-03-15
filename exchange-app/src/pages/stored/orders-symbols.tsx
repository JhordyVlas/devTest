import { prisma } from "@/common/libs";
import {
  InstumentsTable,
  OrdersTable,
  type Instrument,
  type Order,
} from "@/components/shared";
import { GetServerSideProps } from "next";
import { ScriptProps } from "next/script";

interface Props extends ScriptProps {
  orders: Order[];
  symbols: Instrument[];
}

export default function OrdersAndSymbols({ orders, symbols }: Props) {
  return (
    <main className="grid grid-cols-2 gap-3">
      <div className="col-span-2 flex w-full bg-white rounded-lg py-3 px-5 shadow justify-between items-center">
        <div>
          <h1 className="text-2xl">Saved Orders & Symbols Table</h1>
          <p className="block text-gray-500 text-sm">
            To store the orders and symbols in the local storage press save
            button
          </p>
        </div>
      </div>
      <OrdersTable data={orders} filter={true} />
      <InstumentsTable data={symbols} filter={true} />
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const orders = await prisma.orders.findMany();
  const symbols = (await prisma.symbols.findMany()).map((value) => {
    return {
      symbol: value.name,
      state: value.state,
    };
  });

  return {
    props: {
      orders,
      symbols,
    },
  };
};
