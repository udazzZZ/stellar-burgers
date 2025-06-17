const API_URL = Cypress.env('BURGER_API_URL');

// Игнорировать необработанные исключения
Cypress.on('uncaught:exception', () => {
  return false;
});

beforeEach(() => {
  // Очистка localStorage и cookies
  cy.clearAllCookies();
  cy.clearAllLocalStorage();

  // Установка моковых токенов авторизации
  window.localStorage.setItem('refreshToken', 'testRefreshToken');
  cy.setCookie('accessToken', 'testAccessToken');

  // Перехват запроса ингредиентов
  cy.fixture('ingredients.json').then((ingredients) => {
    cy.intercept(
      {
        method: 'GET',
        url: `${API_URL}/ingredients`
      },
      ingredients
    ).as('getIngredients');
  });

  // Перехват запроса заказов
  cy.fixture('orders.json').then((orders) => {
    cy.intercept(
      {
        method: 'GET',
        url: `${API_URL}/orders/all`
      },
      orders
    ).as('getOrders');
  });

  // Перехват запроса данных пользователя
  cy.fixture('user.json').then((user) => {
    cy.intercept(
      {
        method: 'GET',
        url: `${API_URL}/auth/user`
      },
      user
    ).as('getUser');
  });

  // Посещение главной страницы и ожидание загрузки ингредиентов
  cy.visit('/');
  cy.wait('@getIngredients');
});

describe('Тестирование конструктора бургера', () => {
  it('Страница конструктора должна быть доступна', () => {
    cy.contains('Соберите бургер');
  });

  it('Должна быть возможность добавить булку и ингредиенты в конструктор', () => {
    // Проверяем начальное состояние конструктора (должен быть пустым)
    cy.get('[data-testid="constructor"]').within(() => {
      cy.contains('Выберите булки');
      cy.contains('Выберите начинку');
    });

    // Добавляем булку (первый элемент из категории булок)
    cy.get('[data-testid="ingredient-bun"]')
      .first()
      .find('button')
      .contains('Добавить')
      .click();

    // Добавляем начинку (первый элемент из категории начинок)
    cy.get('[data-testid="ingredient-main"]')
      .first()
      .find('button')
      .contains('Добавить')
      .click();

    // Проверяем, что элементы добавлены в конструктор
    cy.get('[data-testid="constructor"]').within(() => {
      cy.contains('Краторная булка');
      cy.get('[data-testid="constructor-ingredients"]').should('exist');
    });
  });

  it('Должна быть возможность открыть и закрыть модальное окно с деталями ингредиента', () => {
    // Открываем модальное окно, кликая по ингредиенту
    cy.get('[data-testid="ingredient-bun"]').first().click();

    // Проверяем, что модальное окно открылось
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.contains('Описание ингредиента');

    // Закрываем модальное окно, кликая по кнопке закрытия
    cy.get('[data-testid="modal-close-button"]').click();

    // Проверяем, что модальное окно закрылось
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('Должна быть возможность закрыть модальное окно, кликая по оверлею', () => {
    // Открываем модальное окно, кликая по ингредиенту
    cy.get('[data-testid="ingredient-bun"]').first().click();

    // Проверяем, что модальное окно открылось
    cy.get('[data-testid="modal"]').should('be.visible');

    // Закрываем модальное окно, кликая по оверлею
    cy.get('[data-testid="modal-overlay"]').click({ force: true });

    // Проверяем, что модальное окно закрылось
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('Должна быть возможность создать заказ', () => {
    // Добавляем булку в конструктор
    cy.get('[data-testid="ingredient-bun"]')
      .first()
      .find('button')
      .contains('Добавить')
      .click();

    // Добавляем начинку в конструктор
    cy.get('[data-testid="ingredient-main"]')
      .first()
      .find('button')
      .contains('Добавить')
      .click();

    // Подготавливаем мок для ответа на запрос создания заказа
    cy.fixture('order.json').then((order) => {
      cy.intercept(
        {
          method: 'POST',
          url: `${API_URL}/orders`
        },
        order
      ).as('createOrder');

      // Нажимаем кнопку "Оформить заказ"
      cy.get('[data-testid="constructor"]').contains('Оформить заказ').click();

      // Ждем создания заказа
      cy.wait('@createOrder');

      // Проверяем, что открылось модальное окно с номером заказа
      cy.get('[data-testid="modal"]').should('be.visible');
      cy.get('[data-testid="order-number"]').should('contain', '12345');

      // Закрываем модальное окно
      cy.get('[data-testid="modal-close-button"]').click();

      // Проверяем, что конструктор очистился после создания заказа
      cy.get('[data-testid="constructor"]').within(() => {
        cy.contains('Выберите булки');
        cy.contains('Выберите начинку');
      });
    });
  });
});
