import { FC } from "react";
import { Todo } from "../api/Todo";

interface TodoItemProps {
  item: Todo;
  onDeleteTodo: (id: string) => void;
}

const TodoItem: FC<TodoItemProps> = ({ item, onDeleteTodo }) => {
  return (
    <ul>
      <li>id: {item.id}</li>
      <li>list_id: {item.list_id}</li>
      <li>important: {item.important}</li>
      <li>completed: {item.completed}</li>
      <li>{item.text}</li>
      <li>{item.notes}</li>
      <li>
        <button onClick={onDeleteTodo.bind(null, item.id)}>DELETE</button>
      </li>
    </ul>
  );
};

export default TodoItem;
