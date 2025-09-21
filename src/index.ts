import './scss/styles.scss';
import './types/index.ts';
import { Api } from './components/base/api';
import { API_URL, API_PATHS } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { Cart } from './components/models/cart';
import { OrderForm } from './components/models/orderForm';
import { GalleryView } from './components/views/galleryView';
import { ProductModalView } from './components/views/productModalView';
import { BasketModalView } from './components/views/basketModalView';
import { OrderModalView } from './components/views/orderModalView';
import { ContactsModalView } from './components/views/contactsModalView';
import { SuccessModalView } from './components/views/successModalView';
import { HeaderBasketView } from './components/views/headerBasketVIew';
import { Product } from './components/models/product';

class AppController {
	private events: EventEmitter;
	private api: Api;
	private cart: Cart;
	private orderForm: OrderForm;
	private galleryView: GalleryView;
	private productModalView: ProductModalView;
	private basketModalView: BasketModalView;
	private orderModalView: OrderModalView;
	private contactsModalView: ContactsModalView;
	private successModalView: SuccessModalView;
	private headerBasketView: HeaderBasketView;

	constructor() {
		this.events = new EventEmitter();
		this.api = new Api(API_URL);
		this.cart = new Cart();
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

	private setupEventListeners(): void {
		// Открытие карточки продукта
		this.events.on('product:clicked', ({ id }: { id: string }) => {
			const product = Product.products.find((p) => p.id === id);
			if (product) {
				const inCart = this.cart.products.some((p) => p.id === id);
				this.productModalView.render(product, inCart);
			}
		});

		// Добавление в корзину
		this.events.on('product:addToCart', ({ id }: { id: string }) => {
			const product = Product.products.find((p) => p.id === id);
			if (product) {
				product.addToCart();
				this.productModalView.render(product, true);
				this.headerBasketView.render(this.cart.products.length.toString());
			}
		});

		// Удаление из корзины
		this.events.on(
			'product:removeFromCart',
			({ id, fromCart }: { id: string; fromCart: boolean }) => {
				const product = Product.products.find((p) => p.id === id);
				if (product) {
					product.removeFromCart();
					this.headerBasketView.render(this.cart.products.length.toString());
					this.events.emit('cart:changed');
					if (fromCart) return;
					this.productModalView.render(product, false);
				}
			}
		);

		// Обновление корзины
		this.events.on('cart:changed', () => {
			this.basketModalView.render(this.cart);
		});

		// Открытие корзины
		this.events.on('cart:open', () => {
			this.basketModalView.render(this.cart);
		});

		// Открытие формы заказа
		this.events.on('order:open', () => {
			this.orderModalView.render();
		});

		// Выбор способа оплаты
		this.events.on(
			'order:paymentSelected',
			({ payment }: { payment: PaymentType }) => {
				this.orderForm.setPayment(payment);
			}
		);

		// Отправка адреса
		this.events.on('order:submit', ({ address }: { address: string }) => {
			this.orderForm.setAddress(address);
			const validation = this.orderForm.validate();
			if (validation.valid) {
				this.contactsModalView.render();
			} else {
				console.warn('Ошибка валидации адреса:', validation.errors);
				this.events.emit('validation:failed', { errors: validation.errors });
			}
		});

		// Отправка контактов
		this.events.on(
			'contacts:submit',
			({ email, phone }: { email: string; phone: string }) => {
				this.orderForm.setEmail(email);
				this.orderForm.setPhone(phone);
				const validation = this.orderForm.validate();
				if (validation.valid) {
					this.submitOrder();
				} else {
					console.warn('Ошибка валидации контактов:', validation.errors);
					this.events.emit('validation:failed', { errors: validation.errors });
				}
			}
		);

		// Закрытие успешного заказа
		this.events.on('success:close', () => {
			this.cart.clear();
			this.orderForm = new OrderForm(); // Сбрасываем форму
			this.events.emit('cart:changed');
		});

		// Обработка ошибок валидации
		this.events.on('validation:failed', ({ errors }: { errors: string[] }) => {
			console.warn('Ошибки валидации:', errors);
			// Можно добавить отображение ошибок во вьюхах
		});
	}

	private loadProducts(): void {
		this.api
			.get(API_PATHS.PRODUCTS)
			.then((response: IProductsResponse) => {
				response.items.forEach((item: IProduct) => {
					new Product(item, this.cart);
				});
				this.galleryView.render(Product.products);
			})
			.catch((error) => {
				console.error('Ошибка загрузки продуктов:', error);
			});
	}

	private submitOrder(): void {
		const orderData = this.orderForm.prepareForApi(this.cart);
		this.api
			.post(API_PATHS.ORDER, orderData)
			.then((response: IOrderSuccessResponse) => {
				this.successModalView.render(response.total);
			})
			.catch((error) => {
				console.error('Ошибка отправки заказа:', error);
				this.events.emit('validation:failed', {
					errors: ['Ошибка отправки заказа'],
				});
			});
	}
}

const app = new AppController();
