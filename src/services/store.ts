import { configureStore } from '@reduxjs/toolkit';
import stellarBurgerSlice from './slices/stellarBurgerSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import userSlice from './slices/userSlice';

const store = configureStore({
  reducer: {
    stellarBurger: stellarBurgerSlice,
    user: userSlice
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
