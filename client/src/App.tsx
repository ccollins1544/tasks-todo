import { useState, useEffect, FC } from "react";
import "./App.css";
import { socket, sendMessageWithTimeout } from "./socket";
import NewTodo from "./components/NewTodo";
import TodoList from "./components/TodoList";
import { Todo } from "./api/Todo";
import { ConnectionState } from "./components/ConnectionState";
import { ConnectionManager } from "./components/ConnectionManager";

// @todo_cc add styling
// @todo_cc create shared lists for todos
// @todo_cc mark tasks as complete
// @todo_cc mark tasks as important
// @todo_cc add notes to tasks

const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const todoAddHandler = (text: string) => {
    const newTodo: Todo = {
      id: Math.random().toString(),
      text,
      list_id: "1",
      notes: "",
      important: false,
      completed: false,
    };

    setTodos((prev) => [...prev, newTodo]);
    sendMessageWithTimeout("addTodo", newTodo, 5)
      .then((response) => {
        console.log("addTodo response", response);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("addTodo error", error);
        setIsLoading(false);
      });
  };

  const todoDeleteHandler = (todoId: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
    sendMessageWithTimeout("deleteTodo", todoId, 5)
      .then((response) => {
        console.log("deleteTodo response", response);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("deleteTodo error", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    // Broadcasts
    function onAddTodoBroadcast(todo: Todo) {
      setTodos((prev) => [...prev, todo]);
    }

    function onDeleteTodoBroadcast(todoId: string) {
      setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
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
      <ConnectionState isConnected={isConnected} />
      <ConnectionManager isConnected={isConnected} />
      <h1>My Todos</h1>
      <NewTodo
        onAddTodo={todoAddHandler}
        disabled={isLoading || !isConnected}
      />
      <TodoList items={todos} onDeleteTodo={todoDeleteHandler} />
    </div>
  );
};

export default App;
