import { Basket } from './basket';

export class OrderForm {
	private data: IOrderData = {};

	setPayment(payment: PaymentType) {
		this.data.payment = payment;
	}

	setAddress(address: string) {
		this.data.address = address;
	}

	setEmail(email: string) {
		this.data.email = email;
	}

	setPhone(phone: string) {
		this.data.phone = phone;
	}

	get orderData(): IOrderData {
		return this.data;
	}

	prepareForApi(basket: Basket): IOrderDataAPI {
		return {
            ...this.data,
			total: basket.total,
			items: basket.products.map((p) => p.id),
		};
	}
}
