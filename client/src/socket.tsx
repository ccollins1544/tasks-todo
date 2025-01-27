import { io, Socket } from "socket.io-client";

const autoConnect = process.env.REACT_APP_SOCKET_AUTO_CONNECT
  ? process.env.REACT_APP_SOCKET_AUTO_CONNECT === "true"
  : false;
const URL: string = process.env.VITE_SERVER_URL || "http://localhost:3005";
const socket: Socket = io(URL, {
  autoConnect, // By default, the Socket.IO client opens a connection to the server right away. You can prevent this behavior with the autoConnect
});

const sendMessageWithTimeout = (
  event: string,
  data: unknown,
  timeoutSeconds: number // maximum time to wait for a response (in seconds)
): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line prefer-const
    let timeoutId: NodeJS.Timeout;

    const listener = (response: unknown) => {
      clearTimeout(timeoutId);
      socket.off(event, listener);
      resolve(response);
    };

    socket.on(event, listener);

    timeoutId = setTimeout(() => {
      socket.off(event, listener);
      reject(new Error("Timeout reached"));
    }, timeoutSeconds * 1000);

    socket.emit(event, data);
  });
};

export { socket, sendMessageWithTimeout };
