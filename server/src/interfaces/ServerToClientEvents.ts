import { Todo } from "./Todo";
import { TodoList } from "../models/todoList";

// Used when sending broadcasting events
export interface ServerToClientEvents {
  receiveTodoList: (todoList: TodoList) => void;
  addTodoBroadcast: (todo: Todo, todoListId: string) => void;
  updateTodoBroadcast: (todo: Todo, todoListId: string) => void;
  deleteTodoBroadcast: (todoId: string, todoListId: string) => void;
  addTodo: (todoItem: Todo) => void;
  updateTodo: (todoItem: Todo) => void;
  deleteTodo: (todoId: string) => void;
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  ping: (cb: (response: string) => void) => void;
}
