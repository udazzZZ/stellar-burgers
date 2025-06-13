import {
  getFeedsApi,
  getIngredientsApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TConstructorIngredient,
  TConstructorItems,
  TIngredient,
  TOrder
} from '@utils-types';

export type TFeed = {
  total: number;
  totalToday: number;
};

export type TInitialState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  orderData: TOrder | null;
  constructorItems: TConstructorItems;
  orderRequest: boolean;
  errorText: string;
  orders: TOrder[];
  userOrders: TOrder[];
  feed: TFeed | null;
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
  orders: [],
  userOrders: [],
  feed: null
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
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    },
    moveUpIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      const ingredients = state.constructorItems.ingredients;
      const index = ingredients.findIndex(
        (item) => item._id === action.payload._id
      );
      if (index > 0) {
        [ingredients[index - 1], ingredients[index]] = [
          ingredients[index],
          ingredients[index - 1]
        ];
      }
    },
    moveDownIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      const ingredients = state.constructorItems.ingredients;
      const index = ingredients.findIndex(
        (item) => item._id === action.payload._id
      );
      if (index !== -1 && index < ingredients.length - 1) {
        [ingredients[index], ingredients[index + 1]] = [
          ingredients[index + 1],
          ingredients[index]
        ];
      }
    }
  },
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectIsLoading: (state) => state.isLoading,
    selectOrderData: (state) => state.orderData,
    selectConstructorItems: (state) => state.constructorItems,
    selectOrderRequest: (state) => state.orderRequest,
    selectErrorText: (state) => state.errorText,
    selectOrders: (state) => state.orders,
    selectUserOrders: (state) => state.userOrders,
    selectFeed: (state) => state.feed
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
      .addCase(fetchNewOrder.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.feed = {
          total: action.payload.total,
          totalToday: action.payload.totalToday
        };
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText = action.error.message || 'Failed to fetch orders';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText = action.error.message || 'Failed to fetch user orders';
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

export const fetchOrders = createAsyncThunk('orders/getAll', async () =>
  getFeedsApi()
);

export const fetchUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async () => getOrdersApi()
);

export const {
  selectIsLoading,
  selectIngredients,
  selectOrderData,
  selectConstructorItems,
  selectOrderRequest,
  selectErrorText,
  selectOrders,
  selectUserOrders,
  selectFeed
} = stellarBurgerSlice.selectors;
export const {
  addIngredient,
  deleteIngredient,
  closeOrderRequest,
  moveDownIngredient,
  moveUpIngredient
} = stellarBurgerSlice.actions;
export default stellarBurgerSlice.reducer;
