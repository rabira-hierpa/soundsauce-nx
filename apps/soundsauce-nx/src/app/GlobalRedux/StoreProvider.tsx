'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '../GlobalRedux/store';
import getTodos from '../GlobalRedux/features/todos/todosSlice';

export default function StoreProvider({
  children,
  todos,
}: {
  children: React.ReactNode;
  todos: Todo[];
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    storeRef.current.dispatch(getTodos(todos));
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
