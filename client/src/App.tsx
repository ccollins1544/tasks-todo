import { useContext, FC } from "react";
import NewTodo from "./components/NewTodo";
import TodoList from "./components/TodoList";
import TodoItem from "./components/TodoItem";
import { ConnectionManager } from "./components/ConnectionManager";
import TodoListsContext from "./context/todoLists";

const App: FC = () => {
  const {
    sharedLists,
    todos,
    isLoading,
    isConnected,
    socketId,
    selectedTodoItem,
    todoSelectedHandler,
    todoAddHandler,
    todoDeleteHandler,
    todoToggleChangesHandler,
  } = useContext(TodoListsContext);

  return (
    <div className="App">
      <div className="grid grid-cols-3 gap-4">
        <div className="px-4 flex flex-col">
          <ul className="list-disc m-4 px-4">
            {sharedLists.map((list) => (
              <li key={list.id} className="my-2">
                <h2>{list.name}</h2>
              </li>
            ))}
          </ul>
          <div className="flex flex-row justify-between">
            <ConnectionManager isConnected={isConnected} socketId={socketId} />
          </div>
        </div>
        <div className="px-4 flex flex-col">
          <TodoList items={todos} todoSelectedHandler={todoSelectedHandler} />
          <NewTodo
            onAddTodo={todoAddHandler}
            disabled={!isConnected || isLoading}
          />
        </div>
        <div>
          <TodoItem
            item={selectedTodoItem}
            onDeleteTodo={todoDeleteHandler}
            onToggleImportant={todoToggleChangesHandler}
            onToggleDone={todoToggleChangesHandler}
            disabled={!isConnected || isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
