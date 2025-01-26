import { Todo } from "./Todo";

// Used when receiving events from the client
export interface ClientToServerEvents {
  addTodo: (todoItem: Todo) => void;
  updateTodo: (todoItem: Todo) => void;
  deleteTodo: (todoId: string) => void;
}
