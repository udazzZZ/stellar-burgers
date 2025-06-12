import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  TLoginData,
  TRegisterData
} from 'src/utils/burger-api';
import { setCookie } from 'src/utils/cookie';
import { TUser } from 'src/utils/types';

export type TInitialState = {
  isAuth: boolean;
  isInit: boolean;
  user: TUser | null;
  isLoading: boolean;
  errorText: string | null;
};

export const initialState: TInitialState = {
  isAuth: false,
  isInit: false,
  user: null,
  isLoading: false,
  errorText: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    init(state) {
      state.isInit = true;
    }
  },
  selectors: {
    selectIsAuth: (state) => state.isAuth,
    selectUser: (state) => state.user
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText = action.error.message || null;
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.isAuth = true;
        state.isLoading = false;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(fetchRegisterUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText = action.error.message || null;
      })
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isInit = true;
        state.errorText = action.error.message || null;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInit = true;
        state.user = {
          email: action.payload.user.email,
          name: action.payload.user.name
        };
        state.isAuth = true;
      });
  }
});

export const fetchLoginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => loginUserApi(data)
);

export const fetchRegisterUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => registerUserApi(data)
);

export const getUserThunk = createAsyncThunk('user/get', async () =>
  getUserApi()
);

export const { init } = userSlice.actions;
export const { selectIsAuth, selectUser } = userSlice.selectors;
export default userSlice.reducer;
