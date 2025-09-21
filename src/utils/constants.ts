export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;


// Пути API
export const API_PATHS = {
	PRODUCTS: '/product/',
	PRODUCT: (id: string) => `/product/${id}`,
	ORDER: '/order',
};

export const settings = {};
