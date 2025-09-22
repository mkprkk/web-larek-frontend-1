interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: ProductCategory;
	price: number | null;
}

interface IProductInstance extends IProduct {
	addToBasket: () => void;
	removeFromBasket: () => void;
}

interface IProductsResponse {
	items: IProduct[];
	total: number;
}

interface IBasket {
	products: IProduct[];
	total: number;
	addProduct: (product: IProduct) => void;
	removeProduct: (productId: string) => void;
	calculateTotal: () => void;
	clear: () => void;
}

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

interface IOrderSuccessResponse {
	id: string;
	total: number;
}

interface IErrorResponse {
	error: string;
}

type ProductCategory =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

type PaymentType = string;

interface iSelectors {
	[key: string]: string | iSelectors;
}
