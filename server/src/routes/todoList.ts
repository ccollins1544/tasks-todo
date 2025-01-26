import { Router, Request, Response, NextFunction } from "express";
const router = Router();
import { Todo } from "../interfaces";
import { TodoList } from "../models/todoList";
import {
  createTodoList,
  getTodoLists,
  getTodoListById,
  updateTodoList,
  updateTodoListName,
  deleteTodoListById,
  deleteAllTodoLists,
} from "../controllers/todoList";

router
  .get("/", (_: Request, res: Response) => {
    const allLists: TodoList[] = getTodoLists();
    res.status(200).json(allLists);
  })
  .post("/", (req: Request, res: Response) => {
    const { list_id, list_name } = (req?.body || {}) as {
      list_id: string;
      list_name: string;
    };
    const newList: TodoList = createTodoList(list_id, list_name);
    res.status(201).json(newList);
  })
  .delete("/", (_: Request, res: Response) => {
    deleteAllTodoLists();
    res.status(200).json({ success: true });
  })
  .get("/:list_id", (req: Request, res: Response) => {
    const listId = req.params.list_id;
    const list: TodoList | undefined = getTodoListById(listId);
    res.status(200).json(list);
  })
  .patch("/:list_id", (req: Request, res: Response) => {
    const listId = req.params.list_id;
    const { list_name, action, data } = (req?.body || {}) as {
      list_name: string;
      action: string;
      data: Todo;
    };

    if (action === "update_name") {
      const updatedList = updateTodoListName(listId, list_name);
      res.status(200).json(updatedList);
    } else {
      const updatedList = updateTodoList(listId, action, data);
      res.status(200).json(updatedList);
    }
  })
  .delete("/:list_id", (req: Request, res: Response) => {
    const listId = req.params.list_id;
    const success = deleteTodoListById(listId);
    res.status(200).json({ success });
  });

export default router;
