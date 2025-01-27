import { FC } from "react";
import { Todo } from "../api/Todo";
import Button from "./Button";
import { GoTrash } from "react-icons/go";
import { TbLabelImportant, TbLabelImportantFilled } from "react-icons/tb";
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";

interface TodoItemProps {
  item: Todo | null;
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
  if (!item) {
    return <div>No todo selected</div>;
  }
  return (
    <ul className="list-none">
      <li className="font-bold">{item.text}</li>
      <li className="font-medium">
        <p>Notes: {item.notes}</p>
      </li>
      <li className="flex flex-row justify-start mt-4">
        <Button
          onClick={onDeleteTodo.bind(null, item.id)}
          loading={disabled}
          className="mr-2"
        >
          <GoTrash />
        </Button>
        <Button
          onClick={onToggleImportant.bind(null, item.id, "important")}
          loading={disabled}
          className="mr-2"
        >
          {item.important ? <TbLabelImportantFilled /> : <TbLabelImportant />}
          {item.important ? "Mark not Important" : "Mark as Important"}
        </Button>
        <Button
          onClick={onToggleDone.bind(null, item.id, "completed")}
          loading={disabled}
          className="mr-2"
        >
          {item.completed ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
          {item.completed ? "Mark not Done" : "Mark as Done"}
        </Button>
      </li>
    </ul>
  );
};

export default TodoItem;
