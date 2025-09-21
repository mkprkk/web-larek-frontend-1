import { Cart } from "./cart";

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

    validate(): IValidationResult {
        const errors: string[] = [];

        if (!this.data.payment) {
            errors.push('Не выбран способ оплаты');
        }
        if (!this.data.address || this.data.address.trim().length < 5) {
            errors.push('Введите корректный адрес');
        }
        if (!this.data.email || !this.data.email.includes('@')) {
            errors.push('Введите корректный email');
        }
        if (!this.data.phone || this.data.phone.length < 10) {
            errors.push('Введите корректный телефон');
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    }

    prepareForApi(cart: Cart): IOrderDataAPI {
        return {
            payment: this.data.payment!,
            email: this.data.email!,
            phone: this.data.phone!,
            address: this.data.address!,
            total: cart.total,
            items: cart.products.map((p) => p.id),
        };
    }
}