# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TypeScript, Webpack

## Описание проекта
"Веб-ларек" — это веб-приложение для онлайн-магазина, которое позволяет пользователям просматривать каталог товаров, добавлять их в корзину, оформлять заказы и получать подтверждение покупки. Приложение реализовано с использованием архитектурного паттерна MVP (Model-View-Presenter), обеспечивающего разделение логики данных, отображения и управления взаимодействием.

---

## Структура проекта
- **src/** — исходные файлы проекта
  - **components/** — папка с компонентами приложения
    - **base/** — базовые классы и утилиты
      - **api.ts** — класс `Api` для работы с сервером
      - **events.ts** — класс `EventEmitter` для управления событиями
    - **models/** — модели данных
      - **basket.ts** — модель корзины (`Basket`)
      - **orderForm.ts** — модель формы заказа (`OrderForm`)
      - **product.ts** — модель товара (`Product`)
    - **views/** — представления (UI-компоненты)
      - **mainPage/** — компоненты главной страницы
        - **galleryView.ts** — отображение каталога товаров
        - **headerBasketView.ts** — отображение счетчика корзины в шапке
      - **modals/** — модальные окна
        - **basketModalView.ts** — модальное окно корзины
        - **contactsModalView.ts** — модальное окно ввода контактов
        - **orderModalView.ts** — модальное окно ввода данных заказа
        - **productModalView.ts** — модальное окно карточки товара
        - **successModalView.ts** — модальное окно успешного заказа
  - **pages/** — HTML-страницы
    - **index.html** — главная страница приложения
  - **scss/** — стили
    - **styles.scss** — корневой файл стилей
  - **types/** — TypeScript-типы
    - **index.ts** — описание интерфейсов и типов данных
  - **utils/** — утилиты
    - **constants.ts** — константы (например, `API_URL`, `API_PATHS`)
    - **utils.ts** — вспомогательные функции
  - **index.ts** — точка входа приложения

### Назначение основных элементов
- **index.ts**: Точка входа, создает экземпляр `AppController` и запускает приложение.
- **components/base/api.ts**: Управляет HTTP-запросами к серверу.
- **components/base/events.ts**: Реализует паттерн "Наблюдатель" для обработки событий.
- **components/models/**: Содержит бизнес-логику и данные (корзина, заказ, товары).
- **components/views/**: Отвечает за отображение данных и взаимодействие с пользователем.
- **types/index.ts**: Определяет интерфейсы и типы данных для обеспечения типизации.
- **scss/styles.scss**: Основной файл стилей, собирающий все SCSS-модули.
- **utils/constants.ts**: Хранит константы, такие как URL API и пути запросов.

---

## Установка и запуск
Для установки и запуска проекта выполните следующие команды:

```bash
npm install
npm run start
```

Или, если используется Yarn:

```bash
yarn
yarn start
```

### Сборка
Для сборки проекта в продакшен:

```bash
npm run build
```

Или:

```bash
yarn build
```

---

## Архитектура приложения: MVP
Приложение построено по паттерну **MVP** (Model-View-Presenter), который разделяет ответственность между тремя основными слоями:

1. **Model** (Модель):
   - Отвечает за управление данными и бизнес-логикой.
   - Хранит состояние приложения (например, список товаров, содержимое корзины, данные заказа).
   - Примеры: `Basket`, `OrderForm`, `Product`.

2. **View** (Представление):
   - Отвечает за отображение данных пользователю и обработку пользовательского ввода.
   - Не содержит бизнес-логики, только рендеринг и передача событий.
   - Примеры: `GalleryView`, `ProductModalView`, `BasketModalView`.

3. **Presenter** (Презентер):
   - Координирует взаимодействие между моделью и представлением.
   - Обрабатывает события, обновляет модель и передает данные в представление.
   - Пример: `AppController` выступает в роли презентера, связывая модели и представления через `EventEmitter`.

**Преимущества MVP**:
- Разделение ответственности упрощает тестирование и поддержку кода.
- Модели независимы от UI, что позволяет легко изменять интерфейс.
- Презентер управляет всей логикой взаимодействия, что делает код более организованным.

---

## Описание классов и компонентов

### Класс `AppController`
**Назначение**: Главный класс приложения, выступает в роли презентера в паттерне MVP. Координирует взаимодействие между моделями, представлениями и API.

**Конструктор**:
- Инициализирует `EventEmitter`, `Api`, модели и представления.
- Вызывает методы `setupEventListeners` и `loadProducts`.

**Поля**:
- `events: EventEmitter` — брокер событий для обработки взаимодействий.
- `api: Api` — экземпляр класса для работы с API.
- `basket: Basket` — модель корзины.
- `orderForm: OrderForm` — модель формы заказа.
- `galleryView: GalleryView` — представление каталога товаров.
- `productModalView: ProductModalView` — модальное окно карточки товара.
- `basketModalView: BasketModalView` — модальное окно корзины.
- `orderModalView: OrderModalView` — модальное окно формы заказа.
- `contactsModalView: ContactsModalView` — модальное окно контактов.
- `successModalView: SuccessModalView` — модальное окно успешного заказа.
- `headerBasketView: HeaderBasketView` — представление счетчика корзины в шапке.

**Методы**:
- `private setupEventListeners(): void`
  - Настраивает обработчики событий для координации взаимодействия компонентов.

- `private loadProducts(): void`
  - Загружает список товаров с сервера через `Api.get` и создает экземпляры `Product`.

- `private submitOrder(): void`
  - Отправляет данные заказа на сервер через `Api.post` и отображает результат.

**Программный интерфейс**:
- Управляет событиями, такими как `product:clicked`, `product:addToBasket`, `basket:open`, `order:open`, `contacts:submit` и др.
- Координирует обновление моделей и представлений в ответ на действия пользователя.

---

### Класс `Api` (components/base/api.ts)
**Назначение**: Управляет HTTP-запросами к серверу (GET и POST).

**Конструктор**:
```typescript
constructor(baseUrl: string)
```
- Принимает базовый URL API (`baseUrl: string`).

**Поля**:
- `baseUrl: string` — базовый URL для запросов.

**Методы**:
- `get(path: string): Promise<IProductsResponse | IErrorResponse>`
  - Выполняет GET-запрос для получения данных (например, списка товаров).
  - Параметры: `path: string` — путь API.
  - Возвращает: `Promise<IProductsResponse | IErrorResponse>`.

- `post(path: string, data: object): Promise<IOrderSuccessResponse | IErrorResponse>`
  - Выполняет POST-запрос для отправки данных (например, заказа).
  - Параметры: `path: string` — путь API, `data: object` — данные для отправки.
  - Возвращает: `Promise<IOrderSuccessResponse | IErrorResponse>`.

**Программный интерфейс**:
- Предоставляет методы для взаимодействия с сервером, абстрагируя детали HTTP-запросов.

---

### Класс `EventEmitter` (components/base/events.ts)
**Назначение**: Реализует паттерн "Наблюдатель" для обработки событий в приложении.

**Конструктор**:
- Инициализирует пустой объект для хранения обработчиков событий.

**Поля**:
- `events: { [key: string]: Function[] }` — объект для хранения обработчиков событий.

**Методы**:
- `on(event: string, callback: Function): void`
  - Подписывает обработчик на событие.
  - Параметры: `event: string` — имя события, `callback: Function` — функция-обработчик.
  - Возвращает: `void`.

- `emit(event: string, data?: any): void`
  - Запускает все обработчики, связанные с событием.
  - Параметры: `event: string` — имя события, `data?: any` — данные для передачи.
  - Возвращает: `void`.

**Программный интерфейс**:
- Позволяет компонентам взаимодействовать через события, обеспечивая слабую связанность.

---

### Класс `Basket` (components/models/basket.ts)
**Назначение**: Управляет содержимым корзины, включая добавление/удаление товаров и расчет общей стоимости.

**Конструктор**:
- Инициализирует пустой массив товаров и нулевую сумму.

**Поля**:
- `products: IProduct[]` — массив товаров в корзине.
- `total: number` — общая стоимость товаров.

**Методы**:
- `addProduct(product: IProduct): void`
  - Добавляет товар в корзину.
  - Параметры: `product: IProduct` — товар.
  - Возвращает: `void`.

- `removeProduct(productId: string): void`
  - Удаляет товар из корзины по ID.
  - Параметры: `productId: string` — ID товара.
  - Возвращает: `void`.

- `calculateTotal(): void`
  - Рассчитывает общую стоимость товаров в корзине.
  - Возвращает: `void`.

- `clear(): void`
  - Очищает корзину.
  - Возвращает: `void`.

**Программный интерфейс**:
- Управляет списком товаров в корзине и их стоимостью.
- Используется `AppController` для обновления корзины и передачи данных в `BasketModalView`.

---

### Класс `OrderForm` (components/models/orderForm.ts)
**Назначение**: Хранит данные формы заказа (способ оплаты, адрес, email, телефон).

**Конструктор**:
- Инициализирует пустые значения для полей заказа.

**Поля**:
- `payment: PaymentType` — способ оплаты.
- `address: string` — адрес доставки.
- `email: string` — email пользователя.
- `phone: string` — телефон пользователя.

**Методы**:
- `setPayment(payment: PaymentType): void`
  - Устанавливает способ оплаты.
  - Параметры: `payment: PaymentType` — способ оплаты.
  - Возвращает: `void`.

- `setAddress(address: string): void`
  - Устанавливает адрес доставки.
  - Параметры: `address: string` — адрес.
  - Возвращает: `void`.

- `setEmail(email: string): void`
  - Устанавливает email.
  - Параметры: `email: string` — email.
  - Возвращает: `void`.

- `setPhone(phone: string): void`
  - Устанавливает телефон.
  - Параметры: `phone: string` — телефон.
  - Возвращает: `void`.

- `prepareForApi(basket: IBasket): IOrderDataAPI`
  - Подготавливает данные заказа для отправки на сервер.
  - Параметры: `basket: IBasket` — корзина.
  - Возвращает: `IOrderDataAPI` — объект с данными заказа.

**Программный интерфейс**:
- Хранит и форматирует данные заказа для отправки через API.

---

### Класс `Product` (components/models/product.ts)
**Назначение**: Представляет модель товара, включая добавление/удаление из корзины.

**Конструктор**:
- Параметры: `data: IProduct` — данные товара, `basket: Basket` — корзина.

**Поля**:
- `id: string` — идентификатор товара.
- `description: string` — описание товара.
- `image: string` — URL изображения.
- `title: string` — название товара.
- `category: ProductCategory` — категория товара.
- `price: number | null` — цена товара.
- `static products: IProductInstance[]` — статический массив всех экземпляров `Product`.

**Методы**:
- `addToBasket(): void`
  - Добавляет товар в корзину.
  - Возвращает: `void`.

- `removeFromBasket(): void`
  - Удаляет товар из корзины.
  - Возвращает: `void`.

**Программный интерфейс**:
- Управляет состоянием товара (наличие в корзине).
- Хранит все экземпляры товаров в статическом массиве `products`.

---

### Классы представлений (Views)
#### `GalleryView` (components/views/mainPage/galleryView.ts)
**Назначение**: Отображает каталог товаров на главной странице.
**Конструктор**:
```typescript
constructor(events: EventEmitter)
```
- Параметры: `events: EventEmitter` — брокер событий.
**Методы**:
- `render(products: IProduct[]): void`
  - Отображает список товаров.
  - Параметры: `products: IProduct[]` — массив товаров.
  - Возвращает: `void`.

#### `ProductModalView` (components/views/modals/productModalView.ts)
**Назначение**: Отображает модальное окно с информацией о товаре.
**Конструктор**:
```typescript
constructor(events: EventEmitter)
```
**Методы**:
- `render(product: IProduct, inBasket: boolean): void`
  - Отображает данные товара и статус в корзине.
  - Параметры: `product: IProduct` — товар, `inBasket: boolean` — флаг наличия в корзине.
  - Возвращает: `void`.

#### Другие представления
- `BasketModalView`, `OrderModalView`, `ContactsModalView`, `SuccessModalView`, `HeaderBasketView` имеют аналогичную структуру: принимают `EventEmitter` в конструкторе и реализуют метод `render` для отображения данных.

---

## Типы данных
- **IProduct**:
  ```typescript
  interface IProduct {
      id: string;
      description: string;
      image: string;
      title: string;
      category: ProductCategory;
      price: number | null;
  }
  ```
  Описывает структуру данных товара.

- **IProductInstance**: Расширяет `IProduct`, добавляя методы `addToBasket` и `removeFromBasket`.

- **IProductsResponse**:
  ```typescript
  interface IProductsResponse {
      items: IProduct[];
      total: number;
  }
  ```
  Структура ответа API на запрос списка товаров.

- **IBasket**:
  ```typescript
  interface IBasket {
      products: IProduct[];
      total: number;
      addProduct: (product: IProduct) => void;
      removeProduct: (productId: string) => void;
      calculateTotal: () => void;
      clear: () => void;
  }
  ```
  Описывает корзину.

- **IOrderData** и **IOrderDataAPI**:
  ```typescript
  interface IOrderData {
      payment?: PaymentType;
      email?: string;
      phone?: string;
      address?: string;
  }
  interface IOrderDataAPI extends IOrderData {
      total: number;
      items: string[];
  }
  ```
  Данные заказа для формы и API.

- **IOrderSuccessResponse**:
  ```typescript
  interface IOrderSuccessResponse {
      id: string;
      total: number;
  }
  ```
  Ответ API на успешный заказ.

- **IErrorResponse**:
  ```typescript
  interface IErrorResponse {
      error: string;
  }
  ```
  Ответ API при ошибке.

- **ProductCategory**:
  ```typescript
  type ProductCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';
  ```
  Категории товаров.

- **PaymentType**:
  ```typescript
  type PaymentType = string;
  ```
  Способ оплаты.

---
