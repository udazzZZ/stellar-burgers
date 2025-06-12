import {
  getIngredientsApi,
  loginUserApi,
  orderBurgerApi,
  TLoginData
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorItems, TIngredient, TOrder } from '@utils-types';

export type TInitialState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  orderModalData: TOrder | null;
  constructorItems: TConstructorItems;
  orderRequest: boolean;
  errorText: string;
};

export const initialState: TInitialState = {
  ingredients: [],
  isLoading: false,
  orderModalData: null,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  errorText: ''
};

export const stellarBurgerSlice = createSlice({
  name: 'stellarBurger',
  initialState,
  reducers: {
    addIngredient(state, action: PayloadAction<TIngredient>) {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload;
      } else {
        state.constructorItems.ingredients.push(action.payload);
      }
    },
    deleteIngredient(state, action: PayloadAction<TIngredient>) {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item._id === action.payload._id
      );
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (_, index) => index !== ingredientIndex
        );
    },
    makeOrderRequest(state, action: PayloadAction<TOrder>) {
      state.orderModalData = action.payload;
      state.orderRequest = true;
    }
  },
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectIsLoading: (state) => state.isLoading,
    selectOrderModalData: (state) => state.orderModalData,
    selectConstructorItems: (state) => state.constructorItems,
    selectOrderRequest: (state) => state.orderRequest,
    selectErrorText: (state) => state.errorText
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(fetchLoginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.isLoading = false;
        console.log(action);
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log(action.payload);
      });
  }
});

export const fetchIngredients = createAsyncThunk(
  'ingredients/getAll',
  async () => getIngredientsApi()
);

export const fetchNewOrder = createAsyncThunk(
  'orders/newOrder',
  async (data: string[]) => orderBurgerApi(data)
);

export const fetchLoginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => loginUserApi(data)
);

export const {
  selectIsLoading,
  selectIngredients,
  selectOrderModalData,
  selectConstructorItems,
  selectOrderRequest,
  selectErrorText
} = stellarBurgerSlice.selectors;
export const { addIngredient, makeOrderRequest, deleteIngredient } =
  stellarBurgerSlice.actions;
export default stellarBurgerSlice.reducer;
