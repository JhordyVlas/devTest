import { useEffect, useRef, useState } from "react";

export const useSocket = (url: string) => {
  const socketRef = useRef<WebSocket>();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = new WebSocket(url);

    newSocket.addEventListener("open", () => {
      console.log("WebSocket connection established");
      setConnected(true);
    });

    newSocket.addEventListener("close", () => {
      console.log("WebSocket connection closed");
      setConnected(false);
    });

    newSocket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
      setConnected(false);
    });

    socketRef.current = newSocket;
  }, [url]);

  return {
    socket: socketRef.current,
    connected,
  };
};
