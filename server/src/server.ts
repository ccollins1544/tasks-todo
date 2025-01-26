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
const { createServer } = require("node:http");

const app = express();
const server = createServer(app);

app.use(cors());
app.use(json());

// @todo_cc do something else here...
app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Hello world</h1>");
});

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
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);
  socket.data.socketId = socket.id;
  io.serverSideEmit("ping");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // Testing
  socket.emit("noArg");
  socket.emit("basicEmit", 1, "2", Buffer.from([3]));
  socket.emit("withAck", "4", (e) => {
    // e is inferred as number
  });

  // works when broadcast to all
  io.emit("noArg");

  // works when broadcasting to a room
  io.to("room1").emit("basicEmit", 1, "2", Buffer.from([3]));

  // Todos
  socket.on("addTodo", (todoItem: Todo) => {
    console.log("addTodo", todoItem);
    socket.broadcast.emit("addTodoBroadcast", todoItem);
    socket.emit("addTodo", todoItem);
  });

  socket.on("deleteTodo", (todoId: string) => {
    console.log("deleteTodo", todoId);
    socket.broadcast.emit("deleteTodoBroadcast", todoId);
    socket.emit("deleteTodo", todoId);
  });
});

io.on("ping", () => {
  console.log("ping received");
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});

/**
 * @todo_cc incorporate typescript
 * https://socket.io/docs/v4/typescript/
 *
 * See links:
 * https://socket.io/how-to/use-with-react
 * https://socket.io/docs/v4/tutorial/step-4
 * https://www.youtube.com/watch?v=djMy4QsPWiI&t=664s
 *


### **2. Productivity & Collaboration**

**Task: Real-Time Task Collaboration App**

**Build a simple frontend application that enables users to manage tasks in real time. Users should be able to:**

1. **Add tasks to a shared list.**
2. **Mark tasks as completed.**
3. **Delete tasks.**

**Requirements:**

- **Use React for the frontend.**
- **Use WebSockets (e.g., Socket.IO) to simulate real-time updates.**
- **No backend is required; simulate real-time communication using a local WebSocket server.**

**Bonus Points:**

- **Add basic styling to make the app visually appealing.**
- **Deploy the app to a platform like Vercel or Netlify and provide a demo link.**

*/
