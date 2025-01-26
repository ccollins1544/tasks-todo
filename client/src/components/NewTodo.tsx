import { FC, useRef, FormEvent } from "react";

type NewTodoProps = {
  onAddTodo: (todoText: string) => void;
  disabled: boolean;
};

const NewTodo: FC<NewTodoProps> = ({ onAddTodo, disabled }) => {
  const textInputRef = useRef<HTMLInputElement>(null);

  const SubmitTodo = (event: FormEvent) => {
    event.preventDefault();
    const enteredText = textInputRef.current!.value;
    onAddTodo(enteredText);
    textInputRef.current!.value = ""; // Clear the input field after submission
  };

  return (
    <form onSubmit={SubmitTodo}>
      <div className="form-control">
        <label htmlFor="todo-text">Task</label>
        <input type="text" id="todo-text" ref={textInputRef} />
      </div>
      <button type="submit" disabled={disabled}>
        Create Task
      </button>
    </form>
  );
};

export default NewTodo;
