import { FC } from "react";
import { Todo } from "../api/Todo";
import Button from "./Button";
import { CgSelect } from "react-icons/cg";
import { FaBell } from "react-icons/fa6";

interface TodoListProps {
  items: Todo[];
  todoSelectedHandler: (TodoItem: Todo) => void;
}

const TodoList: FC<TodoListProps> = ({ items, todoSelectedHandler }) => {
  return (
    <ul className="list-decimal p-4">
      {items.map((todo, idx) => (
        <li key={todo.id} className="flex flex-row justify-between my-2">
          <span className={`font-bold ${todo.completed ? "line-through" : ""}`}>
            {idx + 1}. {todo.text}
          </span>
          <Button
            onClick={todoSelectedHandler.bind(null, todo)}
            className="ml-2"
          >
            {todo.important ? <FaBell /> : <CgSelect />}
            <span className="ml-2">Select</span>
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
