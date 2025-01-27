import { FC } from "react";
import { socket } from "../socket";
import Button from "./Button";
import { MdOutlineSignalWifiBad } from "react-icons/md";
import { MdOutlineSignalWifiStatusbar4Bar } from "react-icons/md";

interface ConnectionManagerProps {
  isConnected: boolean;
  socketId: string;
}

const ConnectionManager: FC<ConnectionManagerProps> = ({
  isConnected,
  socketId,
}) => {
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <Button
      onClick={isConnected ? disconnect : connect}
      className="bg-sky-300 hover:bg-sky-400"
    >
      {isConnected ? (
        <MdOutlineSignalWifiStatusbar4Bar />
      ) : (
        <MdOutlineSignalWifiBad />
      )}
      <span className="ml-2">{isConnected ? "Disconnect" : "Connect"}</span>
      {socketId && <small className="ml-2 font-light">{socketId}</small>}
    </Button>
  );
};

export { ConnectionManager };
export default ConnectionManager;
