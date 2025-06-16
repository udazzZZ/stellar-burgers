import { configureStore } from '@reduxjs/toolkit';
import stellarBurgerSlice, {
  initialState as burgerInitialState
} from '../../services/slices/stellarBurgerSlice';
import userSlice from '../../services/slices/userSlice';

describe('Root Reducer', () => {
  it('should properly initialize with default state', () => {
    const store = configureStore({
      reducer: {
        stellarBurger: stellarBurgerSlice,
        user: userSlice
      }
    });

    const state = store.getState();

    // Check that stellarBurger slice is initialized properly
    expect(state.stellarBurger).toEqual(burgerInitialState);

    // Check that user slice is initialized
    expect(state.user).toBeDefined();

    // Check that store has the expected structure
    expect(Object.keys(state)).toEqual(['stellarBurger', 'user']);
  });
});
