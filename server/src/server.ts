require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import { Server } from "socket.io";
const cors = require("cors");
import { json } from "body-parser";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  Todo,
} from "./interfaces";
import { TodoList } from "./models/todoList";
import todoListRoutes from "./routes/todoList";
import {
  getTodoListByName,
  getTodoListById,
  createTodoList,
  updateTodoList,
} from "./controllers/todoList";

const { createServer } = require("node:http");
const app = express();
const server = createServer(app);
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const DEFAULT_TODO_LIST_ID = process.env.TODO_LIST_ID || "list1";
const DEFAULT_TODO_LIST_NAME = process.env.TODO_LIST_NAME || "Shared List";

app.use(cors());
app.use(json());
app.use("/", todoListRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);
  socket.data.socketId = socket.id;

  let sharedList: TodoList | undefined;
  sharedList = getTodoListById(DEFAULT_TODO_LIST_ID);
  if (!sharedList) {
    sharedList = getTodoListByName(DEFAULT_TODO_LIST_NAME);
  }
  if (!sharedList) {
    sharedList = createTodoList(DEFAULT_TODO_LIST_ID, DEFAULT_TODO_LIST_NAME);
  }
  socket.data.todoListId = sharedList.id;

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`, socket.data);
  });

  // Broadcast the list to the newly connected client
  socket.emit("receiveTodoList", sharedList);

  // Todos
  socket.on("addTodo", (todoItem: Todo) => {
    const todoListId = socket.data.todoListId;
    updateTodoList(todoListId, "add", todoItem);
    socket.broadcast.emit("addTodoBroadcast", todoItem, todoListId);
    socket.emit("addTodo", todoItem);
  });

  socket.on("deleteTodo", (todoId: string) => {
    const todoListId = socket.data.todoListId;
    updateTodoList(todoListId, "delete", { id: todoId } as Todo);
    socket.broadcast.emit("deleteTodoBroadcast", todoId, todoListId);
    socket.emit("deleteTodo", todoId);
  });

  socket.on("updateTodo", (todoItem: Todo) => {
    const todoListId = socket.data.todoListId;
    updateTodoList(todoListId, "update", todoItem);
    socket.broadcast.emit("updateTodoBroadcast", todoItem, todoListId);
    socket.emit("updateTodo", todoItem);
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
