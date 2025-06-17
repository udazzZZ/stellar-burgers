import reducer, {
  addIngredient,
  deleteIngredient,
  moveUpIngredient,
  moveDownIngredient,
  initialState
} from '../../services/slices/stellarBurgerSlice';
import { TIngredient } from '../../utils/types';

describe('Constructor Reducer', () => {
  // Mock ingredients
  const bunMock: TIngredient = {
    _id: 'bun1',
    name: 'Test Bun',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 100,
    image: 'bun.png',
    image_large: 'bun_large.png',
    image_mobile: 'bun_mobile.png'
  };

  const sauceMock: TIngredient = {
    _id: 'sauce1',
    name: 'Test Sauce',
    type: 'sauce',
    proteins: 5,
    fat: 5,
    carbohydrates: 5,
    calories: 50,
    price: 50,
    image: 'sauce.png',
    image_large: 'sauce_large.png',
    image_mobile: 'sauce_mobile.png'
  };

  const mainMock: TIngredient = {
    _id: 'main1',
    name: 'Test Main',
    type: 'main',
    proteins: 20,
    fat: 20,
    carbohydrates: 20,
    calories: 200,
    price: 200,
    image: 'main.png',
    image_large: 'main_large.png',
    image_mobile: 'main_mobile.png'
  };

  it('Должен корректно добавлять булку', () => {
    const nextState = reducer(initialState, addIngredient(bunMock));

    expect(nextState.constructorItems.bun).toEqual(bunMock);
  });

  it('Должен корректно добавлять начинку', () => {
    const nextState = reducer(initialState, addIngredient(sauceMock));

    expect(nextState.constructorItems.ingredients).toHaveLength(1);
    expect(nextState.constructorItems.ingredients[0]).toEqual(sauceMock);
  });

  it('Должен корректно удалять ингредиент', () => {
    let state = reducer(initialState, addIngredient(sauceMock));
    state = reducer(state, addIngredient(mainMock));

    expect(state.constructorItems.ingredients).toHaveLength(2);

    const nextState = reducer(state, deleteIngredient(sauceMock));

    expect(nextState.constructorItems.ingredients).toHaveLength(1);
    expect(nextState.constructorItems.ingredients[0]).toEqual(mainMock);
  });

  it('Должен корректно перемещать ингредиент вверх', () => {
    let state = reducer(initialState, addIngredient(sauceMock));
    state = reducer(state, addIngredient(mainMock));

    const mainMockWithId = { ...mainMock, id: mainMock._id };
    const nextState = reducer(state, moveUpIngredient(mainMockWithId));

    expect(nextState.constructorItems.ingredients[0]).toEqual(mainMock);
    expect(nextState.constructorItems.ingredients[1]).toEqual(sauceMock);
  });

  it('Должен корректно перемещать ингредиент вниз', () => {
    let state = reducer(initialState, addIngredient(sauceMock));
    state = reducer(state, addIngredient(mainMock));

    const sauceMockWithId = { ...sauceMock, id: sauceMock._id };
    const nextState = reducer(state, moveDownIngredient(sauceMockWithId));

    expect(nextState.constructorItems.ingredients[0]).toEqual(mainMock);
    expect(nextState.constructorItems.ingredients[1]).toEqual(sauceMock);
  });
});
