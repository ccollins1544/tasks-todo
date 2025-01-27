import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { TodoListsProvider } from "./context/todoLists.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TodoListsProvider>
      <App />
    </TodoListsProvider>
  </StrictMode>
);
