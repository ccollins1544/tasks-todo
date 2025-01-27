import { FC, useRef, FormEvent } from "react";
import Button from "./Button";

type NewTodoProps = {
  onAddTodo: (todoText: string) => void;
  disabled: boolean;
};

const NewTodo: FC<NewTodoProps> = ({ onAddTodo, disabled }) => {
  const textInputRef = useRef<HTMLInputElement>(null);

  const SubmitTodo = (event: FormEvent) => {
    event.preventDefault();
    const enteredText = textInputRef.current!.value;
    if (!enteredText || enteredText.trim().length === 0) {
      console.log("Invalid input", enteredText);
      return;
    }
    onAddTodo(enteredText);
    textInputRef.current!.value = ""; // Clear the input field after submission
  };

  return (
    <form onSubmit={SubmitTodo} className="flex justify-center mt-4">
      <div className="form-control">
        <label>
          <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*'] font-bold mr-2">
            New Task
          </span>
          <input
            ref={textInputRef}
            type="text"
            name="text"
            className="placeholder:text-gray-500 placeholder:italic border-solid border-2 border-gray-500 rounded-sm mr-4 mt-1"
            placeholder="Enter new task..."
          />
        </label>

        {/* <label htmlFor="todo-text">Task</label>
        <input type="text" id="todo-text" ref={textInputRef} /> */}
      </div>
      <Button
        type="submit"
        loading={disabled}
        className="bg-sky-300 hover:bg-sky-400"
      >
        Create Task
      </Button>
    </form>
  );
};

export default NewTodo;
