import { Navbar } from "@/components/layouts";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="h-screen flex-col">
      <Navbar />
      <main className="flex-grow p-4">
        <div className="mx-auto max-w-7xl p-3">
          <Component {...pageProps} />
        </div>
      </main>
    </div>
  );
}
