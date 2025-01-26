import { Todo } from "./Todo";

// Used when sending broadcasting events
export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  addTodoBroadcast: (todo: Todo) => void;
  deleteTodoBroadcast: (todoId: string) => void;
  addTodo: (todoItem: Todo) => void;
  deleteTodo: (todoId: string) => void;
  ping: (cb: (response: string) => void) => void;
}
