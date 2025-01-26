import { FC } from "react";
import { socket } from "../socket";

interface ConnectionManagerProps {
  isConnected: boolean;
}

const ConnectionManager: FC<ConnectionManagerProps> = ({ isConnected }) => {
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <button onClick={isConnected ? disconnect : connect}>
      {isConnected ? "Disconnect" : "Connect"}
    </button>
  );
};

export { ConnectionManager };
export default ConnectionManager;
