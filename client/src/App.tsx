import { useState, useEffect, useRef, FC } from "react";
import "./App.css";
import { socket, sendMessageWithTimeout } from "./socket";
import NewTodo from "./components/NewTodo";
import TodoList from "./components/TodoList";
import { Todo, SharedTodoList } from "./api/Todo";
import { ConnectionState } from "./components/ConnectionState";
import { ConnectionManager } from "./components/ConnectionManager";

// @todo_cc mark tasks as complete
// @todo_cc mark tasks as important
// @todo_cc add notes to tasks
// @todo_cc add styling

const App: FC = () => {
  const [sharedLists, setSharedLists] = useState<SharedTodoList[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);

  const initialized = useRef<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [socketId, setSocketId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const removeTodoFromList = (list_id: string, deletedTodoId: string) => {
    if (!list_id || !deletedTodoId) {
      console.error("Error removing todo from list", {
        list_id,
        deletedTodoId,
      });
      alert("Error removing todo from list"); // @todo_cc remove after testing
      return;
    }
    setSharedLists((prev) =>
      prev.map((l) =>
        l.id === list_id
          ? {
              ...l,
              todos: l.todos.filter((todo) => todo.id !== deletedTodoId),
            }
          : l
      )
    );
  };

  const addTodoItemToList = (list_id: string, newTodo: Todo) => {
    if (!list_id || !newTodo) {
      console.error("Error adding todo to list", { list_id, newTodo });
      alert("Error adding todo to list"); // @todo_cc remove after testing
      return;
    }
    setSharedLists((prev) =>
      prev.map((l) =>
        l.id === list_id ? { ...l, todos: [...l.todos, newTodo] } : l
      )
    );
  };

  const todoAddHandler = (text: string) => {
    const list_id = sharedLists[0]?.id;
    const newTodo: Todo = {
      id: Math.random().toString(),
      text,
      list_id,
      socket_id: socketId,
      notes: "",
      important: false,
      completed: false,
    };

    setTodos((prev) => [...prev, newTodo]);

    sendMessageWithTimeout("addTodo", newTodo, 5)
      .then((response) => {
        // Update sharedLists with new todo
        const { list_id: newListId } = response as Todo;
        addTodoItemToList(newListId, response as Todo);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("addTodo error", error);
        alert("Error adding todo"); // @todo_cc remove after testing

        // Remove todo from local state
        setTodos((prev) => prev.filter((todo) => todo.id !== newTodo.id));
        removeTodoFromList(list_id as string, newTodo.id);
        setIsLoading(false);

        // Disconnect client if error
        socket.disconnect();
      });
  };

  const todoDeleteHandler = (deletedTodoId: string) => {
    const tempTodo = todos.find((todo) => todo.id === deletedTodoId);
    setTodos((prev) => prev.filter((todo) => todo.id !== deletedTodoId));

    sendMessageWithTimeout("deleteTodo", deletedTodoId, 5)
      .then((deletedTodoId) => {
        // Update sharedLists with deleted todo
        const list_id = tempTodo?.list_id || sharedLists[0]?.id;
        removeTodoFromList(list_id, deletedTodoId as string);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("deleteTodo error", error);
        alert("Error deleting todo"); // @todo_cc remove after testing

        // Re-Add todo to local state
        if (tempTodo) {
          setTodos((prev) => [...prev, tempTodo]);
          addTodoItemToList(tempTodo.list_id, tempTodo);
        }

        setIsLoading(false);

        // Disconnect client if error
        socket.disconnect();
      });
  };

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      setSocketId(socket.id);
    }

    function onDisconnect() {
      setIsConnected(false);
      setSocketId("");
      initialized.current = false;
    }

    // Broadcasts
    function initializeTodos(todoList: SharedTodoList) {
      if (
        initialized.current ||
        todoList == null ||
        (!todoList.id && !todoList.name)
      ) {
        return;
      }

      initialized.current = true;
      const list_id = todoList.id;

      setTodos(todoList.todos);

      // Update shared by inserting new or updating existing
      setSharedLists((prev) => {
        const existingList = prev.find(
          (list) => list.id === list_id
        ) as SharedTodoList;
        if (existingList) {
          return prev;
        }
        return [...prev, todoList];
      });
    }

    function onAddTodoBroadcast(todo: Todo, list_id: string) {
      // const list_id = (todo.list_id || sharedLists[0]?.id) as string;
      setTodos((prev) => [...prev, todo]);
      addTodoItemToList(list_id, todo);
    }

    function onDeleteTodoBroadcast(deletedTodoId: string, list_id: string) {
      setTodos((prev) => prev.filter((todo) => todo.id !== deletedTodoId));
      removeTodoFromList(list_id, deletedTodoId);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receiveTodoList", initializeTodos);
    socket.on("addTodoBroadcast", onAddTodoBroadcast);
    socket.on("deleteTodoBroadcast", onDeleteTodoBroadcast);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("addTodoBroadcast", onAddTodoBroadcast);
      socket.off("deleteTodoBroadcast", onDeleteTodoBroadcast);
    };
  }, []);

  return (
    <div className="App">
      <ConnectionState isConnected={isConnected} socketId={socketId} />
      <ConnectionManager isConnected={isConnected} />
      <pre>{JSON.stringify(sharedLists, null, 2)}</pre>
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
            disabled={isLoading || !isConnected}
          />
        </div>
      ))}
    </div>
  );
};

export default App;
