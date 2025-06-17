import { FC, useEffect, useMemo, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useDispatch, useSelector } from 'src/services/store';
import {
  fetchIngredients,
  fetchOrders,
  selectIngredients,
  selectIsLoading,
  selectOrders
} from 'src/services/slices/stellarBurgerSlice';
import { useParams } from 'react-router-dom';
import { NotFound404 } from 'src/pages/not-fount-404';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();
  const orderNumber = Number(number);
  const [dataFetched, setDataFetched] = useState(false);

  const orders: TOrder[] = useSelector(selectOrders);
  const orderData: TOrder | undefined = orders?.find(
    (order) => order.number === orderNumber
  );
  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    const fetchData = async () => {
      if (!orders.length || !ingredients.length) {
        await Promise.all([
          dispatch(fetchOrders()),
          dispatch(fetchIngredients())
        ]);
        setDataFetched(true);
      } else {
        setDataFetched(true);
      }
    };

    fetchData();
  }, [dispatch, orders.length, ingredients.length]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading) {
    return <Preloader />;
  }

  if (dataFetched && !orderData) {
    return <NotFound404 />;
  }

  if (orderInfo) {
    return <OrderInfoUI orderInfo={orderInfo} />;
  }

  return <Preloader />;
};
