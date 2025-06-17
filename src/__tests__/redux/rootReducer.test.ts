import { configureStore } from '@reduxjs/toolkit';
import stellarBurgerSlice, {
  initialState as burgerInitialState
} from '../../services/slices/stellarBurgerSlice';
import userSlice from '../../services/slices/userSlice';

describe('Root Reducer', () => {
  it('Должен корректно инициализироваться с начальным состоянием', () => {
    const store = configureStore({
      reducer: {
        stellarBurger: stellarBurgerSlice,
        user: userSlice
      }
    });

    const state = store.getState();

    expect(state.stellarBurger).toEqual(burgerInitialState);

    expect(state.user).toBeDefined();

    expect(Object.keys(state)).toEqual(['stellarBurger', 'user']);
  });

  it('Должен вернуть начальное состояние при вызове с undefined-состоянием и неизвестным экшеном', () => {
    const store = configureStore({
      reducer: {
        stellarBurger: stellarBurgerSlice,
        user: userSlice
      }
    });

    // Вызываем dispatch с неизвестным экшеном
    store.dispatch({ type: 'UNKNOWN_ACTION' });

    // Проверяем, что состояние соответствует начальному
    const state = store.getState();
    expect(state.stellarBurger).toEqual(burgerInitialState);
    expect(state.user).toBeDefined();
  });
});
