"use client";
import store from '@/lib/readux/store';
import { Provider } from 'react-redux';

function ReducerProvider({children}: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <Provider store={store} >{children}</Provider>
  )
}

export default ReducerProvider