import { TodoList } from "../models/todoList";
import { Todo } from "../interfaces/Todo";

export const ALL_TODO_LISTS: TodoList[] = [];

export const createTodoList = (list_id: string, list_name: string) => {
  const newList = new TodoList(list_id, list_name, []);
  ALL_TODO_LISTS.push(newList);
  return newList;
};

export const getTodoLists = () => {
  return ALL_TODO_LISTS;
};

export const getTodoListById = (list_id: string) => {
  return ALL_TODO_LISTS.find((list) => list.id === list_id);
};

export const getTodoListByName = (list_name: string) => {
  return ALL_TODO_LISTS.find((list) => list.name === list_name);
};

export const updateTodoList = (
  list_id: string,
  action: string = "add",
  data: Todo
) => {
  const list = getTodoListById(list_id);
  if (list) {
    if (action === "add") {
      list.todos.push(data);
    } else if (action === "update") {
      const todoIndex = list.todos.findIndex((todo) => todo.id === data.id);
      if (todoIndex !== -1) {
        list.todos[todoIndex] = data;
      }
    } else if (action === "delete") {
      const todoIndex = list.todos.findIndex((todo) => todo.id === data.id);
      if (todoIndex !== -1) {
        list.todos.splice(todoIndex, 1);
      }
    }
    return list;
  }
  return null;
};

export const updateTodoListName = (list_id: string, list_name: string) => {
  const list = getTodoListById(list_id);
  if (list) {
    list.name = list_name;
    return list;
  }
  return null;
};

export const deleteTodoListById = (list_id: string) => {
  const listIndex = ALL_TODO_LISTS.findIndex((list) => list.id === list_id);
  if (listIndex !== -1) {
    ALL_TODO_LISTS.splice(listIndex, 1);
    return true;
  }
  return false;
};

export const deleteAllTodoLists = () => {
  ALL_TODO_LISTS.splice(0, ALL_TODO_LISTS.length);
};
