import { FC, useEffect, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  fetchIngredients,
  selectIngredients,
  selectIsLoading
} from 'src/services/slices/stellarBurgerSlice';
import { useDispatch } from 'src/services/store';
import { NotFound404 } from 'src/pages/not-fount-404';

export const IngredientDetails: FC = () => {
  const dispatch = useDispatch();
  const params = useParams<{ id: string }>();
  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIsLoading);
  const [dataFetched, setDataFetched] = useState(false);

  const ingredientData = ingredients.find((item) => item._id === params.id);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients()).finally(() => setDataFetched(true));
    } else {
      setDataFetched(true);
    }
  }, [dispatch, ingredients.length]);

  if (isLoading) {
    return <Preloader />;
  }

  if (dataFetched && !ingredientData) {
    return <NotFound404 />;
  }

  if (ingredientData) {
    return <IngredientDetailsUI ingredientData={ingredientData} />;
  }

  return <Preloader />;
};
