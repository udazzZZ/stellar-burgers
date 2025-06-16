import reducer, {
  fetchIngredients,
  initialState
} from '../../services/slices/stellarBurgerSlice';
import { configureStore } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';

describe('Ingredients Reducer', () => {
  // Mock ingredients
  const ingredientsMock: TIngredient[] = [
    {
      _id: 'ing1',
      name: 'Test Ingredient 1',
      type: 'bun',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 100,
      image: 'ing1.png',
      image_large: 'ing1_large.png',
      image_mobile: 'ing1_mobile.png'
    },
    {
      _id: 'ing2',
      name: 'Test Ingredient 2',
      type: 'sauce',
      proteins: 5,
      fat: 5,
      carbohydrates: 5,
      calories: 50,
      price: 50,
      image: 'ing2.png',
      image_large: 'ing2_large.png',
      image_mobile: 'ing2_mobile.png'
    }
  ];

  it('should set isLoading to true when fetchIngredients.pending', () => {
    // Create a pending action
    const action = { type: fetchIngredients.pending.type };

    // Dispatch the action
    const nextState = reducer(initialState, action);

    // Check if isLoading is true
    expect(nextState.isLoading).toBe(true);
  });

  it('should set ingredients and isLoading to false when fetchIngredients.fulfilled', () => {
    // Start with loading state
    const startState = { ...initialState, isLoading: true };

    // Create a fulfilled action with ingredients data
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: ingredientsMock
    };

    // Dispatch the action
    const nextState = reducer(startState, action);

    // Check if ingredients are set and isLoading is false
    expect(nextState.isLoading).toBe(false);
    expect(nextState.ingredients).toEqual(ingredientsMock);
  });

  it('should not change isLoading when fetchIngredients.rejected', () => {
    // Start with loading state
    const startState = { ...initialState, isLoading: true };

    // Create a rejected action with error message
    const errorMessage = 'Failed to fetch ingredients';
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    };

    // Dispatch the action
    const nextState = reducer(startState, action);

    // The current implementation does not handle fetchIngredients.rejected,
    // so isLoading remains unchanged
    expect(nextState.isLoading).toBe(true);
  });
});
