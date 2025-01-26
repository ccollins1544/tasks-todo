import { FC } from "react";
import { Todo } from "../api/Todo";
import TodoItem from "./TodoItem";

interface TodoListProps {
  items: Todo[];
  onDeleteTodo: (id: string) => void;
}

const TodoList: FC<TodoListProps> = ({ items, onDeleteTodo }) => {
  return (
    <ul>
      {items.map((todo) => (
        <li key={todo.id}>
          <TodoItem item={todo} onDeleteTodo={onDeleteTodo} />
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
