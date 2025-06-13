import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  fetchIngredients,
  selectIngredients
} from 'src/services/slices/stellarBurgerSlice';
import { useDispatch } from 'src/services/store';

export const IngredientDetails: FC = () => {
  const dispatch = useDispatch();
  const params = useParams<{ id: string }>();
  const ingredients = useSelector(selectIngredients);
  const ingredientData = ingredients.find((item) => item._id === params.id);

  useEffect(() => {
    if (!ingredientData) {
      dispatch(fetchIngredients());
    }
  }, [ingredientData]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
