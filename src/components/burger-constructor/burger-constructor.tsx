import { FC, useMemo } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector } from 'react-redux';
import {
  closeOrderRequest,
  fetchNewOrder,
  selectConstructorItems,
  selectOrderData,
  selectOrderRequest
} from 'src/services/slices/stellarBurgerSlice';
import { Navigate } from 'react-router-dom';
import { useDispatch } from 'src/services/store';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorItems = useSelector(selectConstructorItems);

  console.log({
    constructorItems
  });

  const orderRequest = useSelector(selectOrderRequest);

  const orderModalData = useSelector(selectOrderData);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    dispatch(
      fetchNewOrder([
        constructorItems?.bun?._id,
        ...constructorItems.ingredients.map((item) => item._id)
      ])
    );
  };
  const closeOrderModal = () => {
    dispatch(closeOrderRequest());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
