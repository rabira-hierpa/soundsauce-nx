import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'todos',
  initialState: {
    todos: [] as Todo[],
  },
  reducers: {
    createTodo: (state, action) => {
      state.todos.push(action.payload);
    },
    getTodos: (state, action) => {
      state.todos = action.payload;
    },
    updateTodo: (state, action) => {
      state.todos.map((todo) =>
        todo.id === action.payload.id ? action.payload : todo
      );
    },
    deleteTodo: (state, action) => {
      state.todos.filter((todo) => todo.id !== action.payload);
    },
  },
});

export default slice.reducer;
