export interface Todo {
  id: string;
  list_id: string;
  socket_id: string;
  text: string;
  notes: string;
  important: boolean;
  completed: boolean;
}
