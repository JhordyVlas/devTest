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
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores
            reiciendis
          </p>
        </div>
      </div>
      {orders.length == 0 ? (
        <div className="flex justify-center items-center bg-white rounded-lg shadow">
          <span>There is no orders saved at this moment</span>
        </div>
      ) : (
        <OrdersTable data={orders} filter={true} />
      )}
      {symbols.length == 0 ? (
        <div className="flex justify-center items-center bg-white rounded-lg shadow">
          <span>There is no symbols saved at this moment</span>
        </div>
      ) : (
        <InstumentsTable data={symbols} filter={true} />
      )}
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
