import './scss/styles.scss';
import './types/index.ts';
import { Api } from './components/base/api';
import { API_URL, API_PATHS } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/models/basket';
import { OrderForm } from './components/models/orderForm';
import { GalleryView } from './components/views/mainPage/galleryView';
import { ProductModalView } from './components/views/modals/productModalView';
import { BasketModalView } from './components/views/modals/basketModalView';
import { OrderModalView } from './components/views/modals/form/orderModalView';
import { ContactsModalView } from './components/views/modals/form/contactsModalView';
import { SuccessModalView } from './components/views/modals/form/successModalView';
import { HeaderBasketView } from './components/views/mainPage/headerBasketVIew';
import { Product } from './components/models/product';

/**
 * Главный класс приложения, управляющий всеми компонентами
 * Координирует взаимодействие между моделями, представлениями и API
 */
class AppController {
	private events: EventEmitter;
	private api: Api;
	private basket: Basket;
	private orderForm: OrderForm;

	// Представления (Views)
	private galleryView: GalleryView;
	private productModalView: ProductModalView;
	private basketModalView: BasketModalView;
	private orderModalView: OrderModalView;
	private contactsModalView: ContactsModalView;
	private successModalView: SuccessModalView;
	private headerBasketView: HeaderBasketView;

	constructor() {
		// Инициализация основных компонентов
		this.events = new EventEmitter();
		this.api = new Api(API_URL);
		this.basket = new Basket();
		this.orderForm = new OrderForm();

		// Инициализация вьюх
		this.galleryView = new GalleryView(this.events);
		this.productModalView = new ProductModalView(this.events);
		this.basketModalView = new BasketModalView(this.events);
		this.orderModalView = new OrderModalView(this.events);
		this.contactsModalView = new ContactsModalView(this.events);
		this.successModalView = new SuccessModalView(this.events);
		this.headerBasketView = new HeaderBasketView(this.events);

		// Подписка на события
		this.setupEventListeners();

		// Загрузка продуктов
		this.loadProducts();
	}

	/**
	 * Настройка обработчиков событий для координации взаимодействия между компонентами
	 */
	private setupEventListeners(): void {
		// Открытие карточки продукта
		this.events.on('product:clicked', ({ id }: { id: string }) => {
			const product = Product.products.find((p) => p.id === id);
			if (product) {
				const inBasket = this.basket.products.some((p) => p.id === id);
				this.productModalView.render(product, inBasket);
			}
		});

		// Добавление в корзину
		this.events.on('product:addToBasket', ({ id }: { id: string }) => {
			const product = Product.products.find((p) => p.id === id);
			if (product) {
				product.addToBasket();
				this.productModalView.render(product, true);
				this.headerBasketView.render(this.basket.products.length.toString());
			}
		});

		// Удаление из корзины
		this.events.on(
			'product:removeFromBasket',
			({ id, fromBasket }: { id: string; fromBasket: boolean }) => {
				const product = Product.products.find((p) => p.id === id);
				if (product) {
					product.removeFromBasket();
					this.headerBasketView.render(this.basket.products.length.toString());
					this.events.emit('basket:changed');
					if (fromBasket) return;
					this.productModalView.render(product, false);
				}
			}
		);

		// Обновление корзины при изменении ее содержимого
		this.events.on('basket:changed', () => {
			this.basketModalView.render(this.basket);
		});

		// Открытие модального окна корзины
		this.events.on('basket:open', () => {
			this.basketModalView.render(this.basket);
		});

		// Открытие формы заказа (шаг 1 - способ оплаты и адрес)
		this.events.on('order:open', () => {
			this.orderModalView.render();
		});

		// Открытие формы контактов (шаг 2 - email и телефон)
		this.events.on('contacts:open', () => {
			this.contactsModalView.render();
		});

		// Выбор способа оплаты
		this.events.on('order:payment', ({ payment }: { payment: PaymentType }) => {
			this.orderForm.setPayment(payment);
		});

		// Установка адреса доставки
		this.events.on('order:address', ({ address }: { address: string }) => {
			this.orderForm.setAddress(address);
		});

		// Установка email
		this.events.on('contacts:email', ({ email }: { email: string }) => {
			this.orderForm.setEmail(email);
		});

		// Установка телефона с очисткой и форматированием
		this.events.on('contacts:phone', ({ phone }: { phone: string }) => {
			const cleanPhone =
				'+7' + phone.replace(/\D/g, '').replace(/^7/, '').replace(/^8/, '');
			this.orderForm.setPhone(cleanPhone);
		});

		// Отправка формы заказа
		this.events.on('contacts:submit', () => {
			this.submitOrder();
			this.events.emit('success:close');
		});

		// Закрытие модального окна успешного заказа и очистка корзины
		this.events.on('success:close', () => {
			this.basket.clear();
			this.headerBasketView.render(this.basket.products.length.toString());
		});
	}

	/**
	 * Загрузка списка продуктов с сервера
	 */
	private loadProducts(): void {
		this.api
			.get(API_PATHS.PRODUCTS)
			.then((response: IProductsResponse) => {
				// Создание экземпляров Product для каждого полученного товара
				response.items.forEach((item: IProduct) => {
					new Product(item, this.basket);
				});
				// Отображение галереи товаров
				this.galleryView.render(Product.products);
			})
			.catch((error: IErrorResponse) => {
				console.error('Ошибка загрузки продуктов:', error);
			});
	}

	/**
	 * Отправка заказа на сервер
	 */
	private submitOrder(): void {
		// Подготовка данных заказа для отправки
		const orderData = this.orderForm.prepareForApi(this.basket);
		this.api
			.post(API_PATHS.ORDER, orderData)
			.then((response: IOrderSuccessResponse) => {
				// Отображение окна успешного заказа с общей суммой
				this.successModalView.render(response.total);
			})
			.catch((error: IErrorResponse) => {
				console.error('Ошибка отправки заказа:', error);
			});
	}
}

// Создание и запуск приложения
const app = new AppController();
