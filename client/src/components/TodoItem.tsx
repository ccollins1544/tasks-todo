import { FC } from "react";
import { Todo } from "../api/Todo";

interface TodoItemProps {
  item: Todo;
  disabled: boolean;
  onDeleteTodo: (id: string) => void;
  onToggleImportant: (id: string, importantField: keyof Todo) => void;
  onToggleDone: (id: string, doneField: keyof Todo) => void;
}

const TodoItem: FC<TodoItemProps> = ({
  item,
  disabled,
  onDeleteTodo,
  onToggleImportant,
  onToggleDone,
}) => {
  return (
    <ul>
      <li>id: {item.id}</li>
      <li>list_id: {item.list_id}</li>
      <li>important: {item.important}</li>
      <li>completed: {item.completed}</li>
      <li>{item.text}</li>
      <li>{item.notes}</li>
      <li>
        <button onClick={onDeleteTodo.bind(null, item.id)} disabled={disabled}>
          DELETE
        </button>
        <button
          onClick={onToggleImportant.bind(null, item.id, "important")}
          disabled={disabled}
        >
          {item.important ? "Mark not Important" : "Mark as Important"}
        </button>
        <button
          onClick={onToggleDone.bind(null, item.id, "completed")}
          disabled={disabled}
        >
          {item.completed ? "Mark not Done" : "Mark as Done"}
        </button>
      </li>
    </ul>
  );
};

export default TodoItem;
