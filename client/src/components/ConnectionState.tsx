import { FC } from "react";

interface ConnectionStateProps {
  isConnected: boolean;
}

const ConnectionState: FC<ConnectionStateProps> = ({ isConnected }) => {
  return <p>State: {"" + isConnected}</p>;
};

export { ConnectionState };
export default ConnectionState;
