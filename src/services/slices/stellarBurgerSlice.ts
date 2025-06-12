import {
  getFeedsApi,
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
  orderData: TOrder | null;
  constructorItems: TConstructorItems;
  orderRequest: boolean;
  errorText: string;
  orders: TOrder[];
};

export const initialState: TInitialState = {
  ingredients: [],
  isLoading: false,
  orderData: null,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  errorText: '',
  orders: []
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
    closeOrderRequest(state) {
      state.orderRequest = false;
      state.orderData = null;
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    }
  },
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectIsLoading: (state) => state.isLoading,
    selectOrderData: (state) => state.orderData,
    selectConstructorItems: (state) => state.constructorItems,
    selectOrderRequest: (state) => state.orderRequest,
    selectErrorText: (state) => state.errorText,
    selectOrders: (state) => state.orders
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
        state.orderData = action.payload.order;
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
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText = action.error.message || 'Failed to fetch orders';
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

export const fetchOrders = createAsyncThunk('orders/getAll', async () =>
  getFeedsApi()
);

export const {
  selectIsLoading,
  selectIngredients,
  selectOrderData,
  selectConstructorItems,
  selectOrderRequest,
  selectErrorText,
  selectOrders
} = stellarBurgerSlice.selectors;
export const { addIngredient, deleteIngredient, closeOrderRequest } =
  stellarBurgerSlice.actions;
export default stellarBurgerSlice.reducer;
