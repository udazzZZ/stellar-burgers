import burgerReducer, {
  fetchIngredients,
  fetchNewOrder,
  fetchOrders,
  initialState as burgerInitialState
} from '../../services/slices/stellarBurgerSlice';

import userReducer, {
  initialState as userInitialState
} from '../../services/slices/userSlice';

import { TUser } from '../../utils/types';

jest.mock('../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn()
}));

global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0
};

describe('Асинхронные экшены stellarBurgerSlice', () => {
  // Mock data
  const ingredientsMock = [
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
    }
  ];

  const orderMock = {
    order: {
      _id: 'order1',
      status: 'done',
      name: 'Test Burger',
      createdAt: '2023-01-01T12:00:00.000Z',
      updatedAt: '2023-01-01T12:00:00.000Z',
      number: 12345
    }
  };

  const ordersMock = {
    orders: [orderMock.order],
    total: 100,
    totalToday: 10
  };

  it('fetchIngredients.pending должен установить isLoading в true', () => {
    const action = { type: fetchIngredients.pending.type };
    const nextState = burgerReducer(burgerInitialState, action);

    expect(nextState.isLoading).toBe(true);
  });

  it('fetchIngredients.fulfilled должен обновить список ингредиентов и установить isLoading в false', () => {
    const startState = { ...burgerInitialState, isLoading: true };
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: ingredientsMock
    };

    const nextState = burgerReducer(startState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.ingredients).toEqual(ingredientsMock);
  });

  it('fetchNewOrder.pending должен установить isLoading в true', () => {
    const action = { type: fetchNewOrder.pending.type };
    const nextState = burgerReducer(burgerInitialState, action);

    expect(nextState.isLoading).toBe(true);
  });

  it('fetchNewOrder.fulfilled должен обновить данные заказа и установить isLoading в false', () => {
    const startState = { ...burgerInitialState, isLoading: true };
    const action = {
      type: fetchNewOrder.fulfilled.type,
      payload: orderMock
    };

    const nextState = burgerReducer(startState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.orderData).toEqual(orderMock.order);
  });

  it('fetchOrders.pending должен установить isLoading в true', () => {
    const action = { type: fetchOrders.pending.type };
    const nextState = burgerReducer(burgerInitialState, action);

    expect(nextState.isLoading).toBe(true);
  });

  it('fetchOrders.fulfilled должен обновить список заказов и установить isLoading в false', () => {
    const startState = { ...burgerInitialState, isLoading: true };
    const action = {
      type: fetchOrders.fulfilled.type,
      payload: ordersMock
    };

    const nextState = burgerReducer(startState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.orders).toEqual(ordersMock.orders);
    expect(nextState.feed).toEqual({
      total: ordersMock.total,
      totalToday: ordersMock.totalToday
    });
  });

  it('fetchOrders.rejected должен установить errorText и isLoading в false', () => {
    const startState = { ...burgerInitialState, isLoading: true };
    const errorMessage = 'Failed to fetch orders';
    const action = {
      type: fetchOrders.rejected.type,
      error: { message: errorMessage }
    };

    const nextState = burgerReducer(startState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.errorText).toBe(errorMessage);
  });
});

describe('Асинхронные экшены userSlice', () => {
  // Очищаем моки перед каждым тестом
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const userMock: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  it('логин пользователя: при pending должен установить userIsLoading в true', () => {
    const action = { type: 'user/login/pending' };
    const nextState = userReducer(userInitialState, action);

    expect(nextState.userIsLoading).toBe(true);
  });

  it('логин пользователя: при fulfilled должен установить isAuth в true и userIsLoading в false', () => {
    const startState = { ...userInitialState, userIsLoading: true };
    const action = {
      type: 'user/login/fulfilled',
      payload: {
        success: true,
        user: userMock,
        accessToken: 'Bearer test_token',
        refreshToken: 'test_refresh_token'
      }
    };

    const nextState = userReducer(startState, action);

    expect(nextState.userIsLoading).toBe(false);
    expect(nextState.isAuth).toBe(true);
  });

  it('логин пользователя: при rejected должен установить errorText и userIsLoading в false', () => {
    const startState = { ...userInitialState, userIsLoading: true };
    const errorMessage = 'Invalid credentials';
    const action = {
      type: 'user/login/rejected',
      error: { message: errorMessage }
    };

    const nextState = userReducer(startState, action);

    expect(nextState.userIsLoading).toBe(false);
    expect(nextState.errorText).toBe(errorMessage);
  });

  it('получение данных пользователя: при pending должен установить userIsLoading в true', () => {
    const action = { type: 'user/get/pending' };
    const nextState = userReducer(userInitialState, action);

    expect(nextState.userIsLoading).toBe(true);
  });

  it('получение данных пользователя: при fulfilled должен обновить данные и установить isAuth в true', () => {
    const startState = { ...userInitialState, userIsLoading: true };
    const action = {
      type: 'user/get/fulfilled',
      payload: { user: userMock }
    };

    const nextState = userReducer(startState, action);

    expect(nextState.userIsLoading).toBe(false);
    expect(nextState.isInit).toBe(true);
    expect(nextState.user).toEqual(userMock);
    expect(nextState.isAuth).toBe(true);
  });

  it('получение данных пользователя: при rejected должен установить errorText и isInit в true', () => {
    const startState = { ...userInitialState, userIsLoading: true };
    const errorMessage = 'Failed to fetch user data';
    const action = {
      type: 'user/get/rejected',
      error: { message: errorMessage }
    };

    const nextState = userReducer(startState, action);

    expect(nextState.userIsLoading).toBe(false);
    expect(nextState.isInit).toBe(true);
    expect(nextState.errorText).toBe(errorMessage);
  });

  it('выход пользователя: при pending должен установить userIsLoading в true', () => {
    const action = { type: 'user/logout/pending' };
    const nextState = userReducer(userInitialState, action);

    expect(nextState.userIsLoading).toBe(true);
  });

  it('выход пользователя: при fulfilled должен сбросить данные и установить isAuth в false', () => {
    const startState = {
      ...userInitialState,
      userIsLoading: true,
      isAuth: true,
      user: userMock
    };

    const action = {
      type: 'user/logout/fulfilled'
    };

    const nextState = userReducer(startState, action);

    expect(nextState.userIsLoading).toBe(false);
    expect(nextState.isAuth).toBe(false);
    expect(nextState.user).toBe(null);
  });

  it('выход пользователя: при rejected должен установить errorText и userIsLoading в false', () => {
    const startState = { ...userInitialState, userIsLoading: true };
    const errorMessage = 'Failed to logout';
    const action = {
      type: 'user/logout/rejected',
      error: { message: errorMessage }
    };

    const nextState = userReducer(startState, action);

    expect(nextState.userIsLoading).toBe(false);
    expect(nextState.errorText).toBe(errorMessage);
  });
});
