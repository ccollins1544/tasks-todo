import io, { Socket } from "socket.io-client";

// @todo_cc clean up
// "undefined" means the URL will be computed from the `window.location` object
// const URL: string | undefined =
//   process.env.NODE_ENV === "production" ? undefined : "http://localhost:3001";
const URL: string = "http://localhost:3001";

const socket: typeof Socket = io(URL, {
  autoConnect: false, // By default, the Socket.IO client opens a connection to the server right away. You can prevent this behavior with the autoConnect
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
