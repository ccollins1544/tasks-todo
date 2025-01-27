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
}
