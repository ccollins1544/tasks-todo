// Used for inter-server communication
export interface InterServerEvents {
  ping: (cb: (response: string) => void) => void;
}
