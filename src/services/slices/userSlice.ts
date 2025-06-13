import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from 'src/utils/burger-api';
import { deleteCookie, setCookie } from 'src/utils/cookie';
import { TUser } from 'src/utils/types';

export type TInitialState = {
  isAuth: boolean;
  isInit: boolean;
  user: TUser | null;
  userIsLoading: boolean;
  errorText: string | null;
};

export const initialState: TInitialState = {
  isAuth: false,
  isInit: false,
  user: null,
  userIsLoading: false,
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
    selectUser: (state) => state.user,
    selectUserIsLoading: (state) => state.userIsLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoginUser.pending, (state) => {
        state.userIsLoading = true;
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.userIsLoading = false;
        state.errorText = action.error.message || null;
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.isAuth = true;
        state.userIsLoading = false;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(fetchRegisterUser.pending, (state) => {
        state.userIsLoading = true;
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.userIsLoading = false;
        state.errorText = action.error.message || null;
      })
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.userIsLoading = false;
      })
      .addCase(getUserThunk.pending, (state) => {
        state.userIsLoading = true;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.userIsLoading = false;
        state.isInit = true;
        state.errorText = action.error.message || null;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.userIsLoading = false;
        state.isInit = true;
        state.user = {
          email: action.payload.user.email,
          name: action.payload.user.name
        };
        state.isAuth = true;
      })
      .addCase(fetchUpdateUser.pending, (state) => {
        state.userIsLoading = true;
      })
      .addCase(fetchUpdateUser.rejected, (state, action) => {
        state.userIsLoading = false;
        state.errorText = action.error.message || null;
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.userIsLoading = false;
        if (action.payload.user) {
          state.user = {
            email: action.payload.user.email,
            name: action.payload.user.name
          };
        }
      })
      .addCase(fetchUserLogout.pending, (state) => {
        state.userIsLoading = true;
      })
      .addCase(fetchUserLogout.rejected, (state, action) => {
        state.userIsLoading = false;
        state.errorText = action.error.message || null;
      })
      .addCase(fetchUserLogout.fulfilled, (state) => {
        state.isAuth = false;
        state.userIsLoading = false;
        state.user = null;
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(fetchPasswordForgot.pending, (state) => {
        state.userIsLoading = true;
      })
      .addCase(fetchPasswordForgot.rejected, (state, action) => {
        state.userIsLoading = false;
        state.errorText = action.error.message || null;
      })
      .addCase(fetchPasswordForgot.fulfilled, (state) => {
        state.userIsLoading = false;
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

export const fetchUpdateUser = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>) => updateUserApi(user)
);

export const fetchUserLogout = createAsyncThunk('user/logout', async () =>
  logoutApi()
);

export const fetchPasswordForgot = createAsyncThunk(
  'user/passwordForgot',
  async (email: string) => forgotPasswordApi({ email: email })
);

export const fetchPasswordReset = createAsyncThunk(
  'user/passwordReset',
  async (data: { password: string; token: string }) => resetPasswordApi(data)
);

export const { init } = userSlice.actions;
export const { selectIsAuth, selectUser, selectUserIsLoading } =
  userSlice.selectors;
export default userSlice.reducer;
