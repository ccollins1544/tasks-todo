import { Todo } from "../interfaces/Todo";

export class TodoList {
  constructor(public id: string, public name: string, public todos: Todo[]) {}
}
