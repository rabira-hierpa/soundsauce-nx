/**
 * This make store defines makeStore function that returns new store for each request
 */
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './features/todos/todosSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      todos: todosReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
