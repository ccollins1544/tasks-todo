import { FC } from "react";

interface ConnectionStateProps {
  isConnected: boolean;
  socketId: string;
}

const ConnectionState: FC<ConnectionStateProps> = ({
  isConnected,
  socketId,
}) => {
  return (
    <p>
      {isConnected ? "Connected ID " : "Not connected"}
      {socketId ? socketId : ""}
    </p>
  );
};

export { ConnectionState };
export default ConnectionState;
