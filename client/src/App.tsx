import { useContext, FC } from "react";
import "./App.css";
import NewTodo from "./components/NewTodo";
import TodoList from "./components/TodoList";
import { ConnectionState } from "./components/ConnectionState";
import { ConnectionManager } from "./components/ConnectionManager";
import TodoListsContext from "./context/todoLists";

// @todo_cc add styling
// @todo_cc deploy live
// @todo_cc add notes to tasks

const App: FC = () => {
  const {
    sharedLists,
    todos,
    isLoading,
    isConnected,
    socketId,
    todoAddHandler,
    todoDeleteHandler,
    todoToggleChangesHandler,
  } = useContext(TodoListsContext);

  return (
    <div className="App">
      <ConnectionState isConnected={isConnected} socketId={socketId} />
      <ConnectionManager isConnected={isConnected} />
      <pre>{JSON.stringify(sharedLists, null, 2)}</pre> {/* @todo_cc remove */}
      {sharedLists.map((list) => (
        <div key={list.id} className="todo-list">
          <h1>{list.name}</h1>
          <NewTodo
            onAddTodo={todoAddHandler}
            disabled={isLoading || !isConnected}
          />
          <TodoList
            items={todos}
            onDeleteTodo={todoDeleteHandler}
            onToggleImportantTodo={todoToggleChangesHandler}
            onToggleDoneTodo={todoToggleChangesHandler}
            disabled={isLoading || !isConnected}
          />
        </div>
      ))}
    </div>
  );
};

export default App;
