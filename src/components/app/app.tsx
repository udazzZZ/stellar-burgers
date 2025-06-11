import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, OrderInfo } from '@components';
import { Route, Routes } from 'react-router-dom';

const App = () => (
  <Routes>
    <Route
      path='*'
      element={
        <div className={styles.app}>
          <AppHeader />
          <NotFound404 />
        </div>
      }
    />
    <Route
      path='/'
      element={
        <div className={styles.app}>
          <AppHeader />
          <ConstructorPage />
        </div>
      }
    />
    <Route
      path='/feed'
      element={
        <div className={styles.app}>
          <AppHeader />
          <Feed />
        </div>
      }
    />
    <Route // TODO: protectAdd commentMore actions
      path='/login'
      element={
        <div className={styles.app}>
          <AppHeader />
          <Login />
        </div>
      }
    />
    <Route // TODO: protect
      path='/register'
      element={
        <div className={styles.app}>
          <AppHeader />
          <Register />
        </div>
      }
    />
    <Route // TODO: protect
      path='/forgot-password'
      element={
        <div className={styles.app}>
          <AppHeader />
          <ForgotPassword />
        </div>
      }
    />
    <Route // TODO: protect
      path='/reset-password'
      element={
        <div className={styles.app}>
          <AppHeader />
          <ResetPassword />
        </div>
      }
    />
    <Route // TODO: protect
      path='/profile'
      element={
        <div className={styles.app}>
          <AppHeader />
          <Profile />
        </div>
      }
    />
    <Route // TODO: protect
      path='/profile/orders'
      element={
        <div className={styles.app}>
          <AppHeader />
          <ProfileOrders />
        </div>
      }
    />
    <Route // TODO: modal
      path='/feed/:number'
      element={
        <div className={styles.app}>
          <AppHeader />
          <OrderInfo />
        </div>
      }
    />
    <Route // TODO: modal
      path='/ingredients/:id'
      element={
        <div className={styles.app}>
          <AppHeader />
          <IngredientDetails />
        </div>
      }
    />
    <Route // TODO: modal, protect
      path='/profile/orders/:number'
      element={
        <div className={styles.app}>
          <AppHeader />
          <OrderInfo />
        </div>
      }
    />
  </Routes>
);

export default App;
