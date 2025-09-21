import { ModalView } from './modalVIew';

const selectors = {
	template: 'basket',
	basketList: '.basket__list',
	templateCardBasket: 'card-basket',
	itemIndex: '.basket__item-index',
	title: '.card__title',
	price: '.card__price',
	deleteBtn: '.basket__item-delete',
	basketPrice: '.basket__price',
	orderButton: '.basket__button',
};

export class BasketModalView extends ModalView {
	render(cart: ICart) {
		const basket = this.cloneTemplate<HTMLDivElement>(selectors.template);
		const list = basket.querySelector(selectors.basketList)!;
		list.innerHTML = '';

		basket.querySelector(
			selectors.basketPrice
		)!.textContent = `${cart.total} синапсов`;

		const orderBtn = basket.querySelector(
			selectors.orderButton
		) as HTMLButtonElement;
		if (orderBtn) {
			orderBtn.addEventListener('click', () => {
				this.events.emit('order:open', { total: cart.total });
			});
		}

		if (cart.products.length === 0) {
			const cartIsEmptyElement = document.createElement('span');
			cartIsEmptyElement.textContent = 'Корзина пуста';
			cartIsEmptyElement.classList.add('basket_empty');
            orderBtn.disabled = true;
			list.append(cartIsEmptyElement);
		}

		cart.products.forEach((product, index) => {
			const item = this.cloneTemplate<HTMLLIElement>(
				selectors.templateCardBasket
			);
			item.querySelector(selectors.itemIndex)!.textContent = (
				index + 1
			).toString();
			item.querySelector(selectors.title)!.textContent = product.title;
			item.querySelector(selectors.price)!.textContent = product.price
				? `${product.price} синапсов`
				: 'Бесценно';
			item.dataset.id = product.id;

			const deleteBtn = item.querySelector(
				selectors.deleteBtn
			) as HTMLButtonElement;
			if (deleteBtn) {
				deleteBtn.addEventListener('click', () => {
					this.events.emit('product:removeFromCart', {
						id: product.id,
						fromCart: true,
					});
				});
			}

			list.append(item);
		});

		this.showModal(basket);
	}
}
