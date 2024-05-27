/* eslint-disable @typescript-eslint/no-unused-expressions */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { baseUrl } from '../../../api/endpoints/todo.endpoints';
import { Todo } from '../../../types';

const slice = createSlice({
  name: 'todos',
  initialState: {
    todos: [] as Todo[],
  },
  reducers: {
    initTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
    },
    createTodo: (state, action) => {
      async () => {
        // Create new todo
        const response = await fetch(baseUrl, {
          method: 'POST',
          body: JSON.stringify(action.payload),
        });
        const newTodo = await response.json();
        state.todos.push(newTodo);
      };
    },
    updateTodo: (state, action) => {
      async () => {
        // Update todo
        const response = await fetch(`${baseUrl}${action.payload.id}`, {
          method: 'PUT',
          body: JSON.stringify(action.payload),
        });
        const updatedTodo = await response.json();
        state.todos = state.todos.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        );
      };
    },
    deleteTodo: (state, action) => {
      async () => {
        // Delete todo
        await fetch(`${baseUrl}${action.payload}`, {
          method: 'DELETE',
        });
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      };
    },
  },
});

export const { initTodos, createTodo, updateTodo, deleteTodo } = slice.actions;
export default slice.reducer;
