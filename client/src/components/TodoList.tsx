import { FC } from "react";
import { Todo } from "../api/Todo";
import TodoItem from "./TodoItem";

interface TodoListProps {
  items: Todo[];
  disabled: boolean;
  onDeleteTodo: (id: string) => void;
  onToggleImportantTodo: (id: string, importantField: keyof Todo) => void;
  onToggleDoneTodo: (id: string, doneField: keyof Todo) => void;
}

const TodoList: FC<TodoListProps> = ({
  items,
  disabled,
  onDeleteTodo,
  onToggleImportantTodo,
  onToggleDoneTodo,
}) => {
  return (
    <ul>
      {items.map((todo) => (
        <li key={todo.id}>
          <TodoItem
            item={todo}
            onDeleteTodo={onDeleteTodo}
            onToggleImportant={onToggleImportantTodo}
            onToggleDone={onToggleDoneTodo}
            disabled={disabled}
          />
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
