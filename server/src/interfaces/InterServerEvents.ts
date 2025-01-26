// Used for inter-server communication

export interface InterServerEvents {
  ping: () => void;
  // ping: (cb: (response: string) => void) => void;
}
