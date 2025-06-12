import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectIsAuthChecked, selectUser } from 'src/services/slices/userSlice';
import { Preloader } from '../ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuth = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);

  if (!isAuth) {
    return <Preloader />; // or a loading spinner
  }

  if (onlyUnAuth && user) {
    return <Navigate replace to='/' />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate replace to='/login' />;
  }

  return children;
};
