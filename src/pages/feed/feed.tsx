import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import {
  fetchOrders,
  selectIsLoading,
  selectOrders
} from 'src/services/slices/stellarBurgerSlice';
import { useDispatch, useSelector } from 'src/services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectIsLoading);

  const handleGetFeeds = async () => {
    try {
      await dispatch(fetchOrders()).unwrap();
    } catch (err) {
      console.error('Ошибка при обновлении заказов:', err);
    }
  };

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

  if (!orders.length || isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
