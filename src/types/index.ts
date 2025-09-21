interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: ProductCategory;
	price: number | null;
}

interface IProductInstance extends IProduct {
	addToCart: () => void;
	removeFromCart: () => void;
}

interface IProductsResponse {
	items: IProduct[];
	total: number;
}

interface ICart {
	products: IProduct[];
	total: number;
	addProduct: (product: IProduct) => void;
	removeProduct: (productId: string) => void;
	calculateTotal: () => void;
	clear: () => void;
}

interface IProductResponse extends IProduct {}

interface IOrderDataAPI {
	payment: PaymentType;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

interface IOrderData {
	payment?: PaymentType;
	email?: string;
	phone?: string;
	address?: string;
}

interface IOrderSuccessResponse {
	id: string;
	total: number;
}

// Ответ с ошибкой
interface IErrorResponse {
	error: string;
}

// Категории продуктов
type ProductCategory =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

// Типы оплаты
type PaymentType = string;

// Тип для ответа продукта
type ProductResponse = IProductResponse | IErrorResponse;

// Тип для ответа списка продуктов
type ProductsResponse = IProductsResponse | IErrorResponse;

// Тип для ответа заказа
type OrderResponse = IOrderSuccessResponse | IErrorResponse;

// Для обработки null цен
type ProductWithPrice = IProduct & { price: number };

// Фильтр для продуктов с ценой
function hasPrice(product: IProduct): product is ProductWithPrice {
	return product.price !== null;
}

// Тип для ошибок API
interface ApiError extends Error {
	status?: number;
	code?: string;
}

interface IValidationResult {
  valid: boolean;
  errors: string[];
}