import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { socket, sendMessageWithTimeout } from "../socket";
import { Todo, SharedTodoList } from "../api/Todo";

type Props = {
  children: ReactNode;
};

type TodoListsContextType = {
  sharedLists: SharedTodoList[];
  todos: Todo[];
  isLoading: boolean;
  isConnected: boolean;
  socketId: string;
  todoAddHandler: (text: string) => void;
  todoDeleteHandler: (deletedTodoId: string) => void;
  todoToggleChangesHandler: (id: string, fieldToToggle: keyof Todo) => void;
};

const initialState: TodoListsContextType = {
  sharedLists: [] as SharedTodoList[],
  todos: [] as Todo[],
  isLoading: false as boolean,
  isConnected: false as boolean,
  socketId: "" as string,
  todoAddHandler: (text: string): void => {
    console.log("todoAddHandler with args", { text });
    throw new Error("todoAddHandler function must be overridden");
  },
  todoDeleteHandler: (deletedTodoId: string): void => {
    console.log("todoDeleteHandler with args", { deletedTodoId });
    throw new Error("todoDeleteHandler function must be overridden");
  },
  todoToggleChangesHandler: (id: string, fieldToToggle: keyof Todo): void => {
    console.log("todoDeleteHandler with args", { id, fieldToToggle });
    throw new Error("todoToggleChangesHandler function must be overridden");
  },
};

const TodoListsContext = createContext<TodoListsContextType>(initialState);
const useTodoListsData = () =>
  useContext<TodoListsContextType>(TodoListsContext);

const TodoListsProvider = ({ children }: Props) => {
  const [sharedLists, setSharedLists] = useState<SharedTodoList[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);

  const initialized = useRef<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [socketId, setSocketId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /*==================================[ sharedLists Functions ]===================================*/
  /**
   * removeTodoFromList
   * Update sharedLists by removing the deleted todo
   * @param list_id
   * @param deletedTodoId
   * @returns
   */
  const removeTodoFromList = (list_id: string, deletedTodoId: string) => {
    if (!list_id || !deletedTodoId) {
      console.error("Error removing todo from list", {
        list_id,
        deletedTodoId,
      });
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

  /**
   * addTodoItemToList
   * Update sharedLists by adding the new todo
   * @param list_id
   * @param newTodo
   * @returns
   */
  const addTodoItemToList = (list_id: string, newTodo: Todo) => {
    if (!list_id || !newTodo) {
      console.error("Error adding todo to list", { list_id, newTodo });
      return;
    }
    setSharedLists((prev) =>
      prev.map((l) =>
        l.id === list_id ? { ...l, todos: [...l.todos, newTodo] } : l
      )
    );
  };

  /**
   * updateTodoItemInList
   * Update sharedLists by updating the edited todo
   * @param list_id
   * @param updatedTodo
   * @returns
   */
  const updateTodoItemInList = (list_id: string, updatedTodo: Todo) => {
    if (!list_id || !updatedTodo) {
      console.error("Error updating todo in list", { list_id, updatedTodo });
      return;
    }
    setSharedLists((prev) =>
      prev.map((l) =>
        l.id === list_id
          ? {
              ...l,
              todos: l.todos.map((todo) =>
                todo.id === updatedTodo.id ? updatedTodo : todo
              ),
            }
          : l
      )
    );
  };

  /*==================================[ todos Functions ]===================================*/
  /**
   * todoAddHandler
   * Add a new todo
   * @param text
   */
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
        const { list_id: newListId } = (response as Todo) || { list_id } || {
            list_id: sharedLists[0]?.id,
          };
        addTodoItemToList(newListId, response as Todo);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("addTodo error", error);

        // Remove todo from local state
        setTodos((prev) => prev.filter((todo) => todo.id !== newTodo.id));
        removeTodoFromList(list_id as string, newTodo.id);
        setIsLoading(false);

        // Disconnect client if error
        socket.disconnect();
      });
  };

  /**
   * todoDeleteHandler
   * Delete a todo
   * @param deletedTodoId
   * @returns
   */
  const todoDeleteHandler = (deletedTodoId: string) => {
    const tempTodo = todos.find((todo) => todo.id === deletedTodoId);
    if (!tempTodo) {
      return;
    }
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

        // Re-Add todo to local state
        setTodos((prev) => [...prev, tempTodo]);
        addTodoItemToList(tempTodo.list_id, tempTodo);
        setIsLoading(false);

        // Disconnect client if error
        socket.disconnect();
      });
  };

  /**
   * todoToggleChangesHandler
   * Toggle important or completed
   * @param id
   * @param fieldToToggle
   * @returns
   */
  const todoToggleChangesHandler = (id: string, fieldToToggle: keyof Todo) => {
    const tempTodo = todos.find((todo) => todo.id === id) as Todo;
    if (!tempTodo) {
      return;
    }

    const updatedTodo = {
      ...tempTodo,
      [fieldToToggle]: !tempTodo[fieldToToggle],
    };
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? updatedTodo : todo))
    );

    sendMessageWithTimeout("updateTodo", updatedTodo, 5)
      .then((updatedTodo) => {
        // Update sharedLists with updated todo
        const { list_id: updatedListId } = (updatedTodo as Todo) ||
          tempTodo || { list_id: sharedLists[0]?.id };
        updateTodoItemInList(updatedListId, updatedTodo as Todo);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(`updateTodo as ${fieldToToggle} error`, error);

        // Undo changes
        setTodos((prev) =>
          prev.map((todo) => (todo.id === id ? tempTodo : todo))
        );

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
      setTodos((prev) => [...prev, todo]);
      addTodoItemToList(list_id, todo);
    }

    function onUpdateTodoBroadcast(updatedTodo: Todo, list_id: string) {
      setTodos((prev) =>
        prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
      );
      updateTodoItemInList(list_id, updatedTodo);
    }

    function onDeleteTodoBroadcast(deletedTodoId: string, list_id: string) {
      setTodos((prev) => prev.filter((todo) => todo.id !== deletedTodoId));
      removeTodoFromList(list_id, deletedTodoId);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receiveTodoList", initializeTodos);
    socket.on("addTodoBroadcast", onAddTodoBroadcast);
    socket.on("updateTodoBroadcast", onUpdateTodoBroadcast);
    socket.on("deleteTodoBroadcast", onDeleteTodoBroadcast);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("addTodoBroadcast", onAddTodoBroadcast);
      socket.off("updateTodoBroadcast", onUpdateTodoBroadcast);
      socket.off("deleteTodoBroadcast", onDeleteTodoBroadcast);
    };
  }, []);

  return (
    <TodoListsContext.Provider
      value={{
        sharedLists,
        todos,
        isLoading,
        isConnected,
        socketId,
        todoAddHandler,
        todoDeleteHandler,
        todoToggleChangesHandler,
      }}
    >
      {children}
    </TodoListsContext.Provider>
  );
};

export { TodoListsProvider, useTodoListsData };
export default TodoListsContext;
