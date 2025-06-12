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

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'src/services/store';

const App = () => {
  const location = useLocation();
  const backgroundLocation = location.state?.background;

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const onModalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route // TODO: protect
          path='/login'
          element={<Login />}
        />
        <Route // TODO: protect
          path='/register'
          element={<Register />}
        />
        <Route // TODO: protect
          path='/forgot-password'
          element={<ForgotPassword />}
        />
        <Route // TODO: protect
          path='/reset-password'
          element={<ResetPassword />}
        />
        <Route // TODO: protect
          path='/profile'
          element={<Profile />}
        />
        <Route // TODO: protect
          path='/profile/orders'
          element={<ProfileOrders />}
        />
        <Route // TODO: modal
          path='/feed/:number'
          element={<OrderInfo />}
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route // TODO: modal, protect
          path='/profile/orders/:number'
          element={<OrderInfo />}
        />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Описание ингредиента'} onClose={onModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
