import { ModalView } from '../abstractions/modalView';

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
	render(basket: IBasket) {
		const basketElement = this.cloneTemplate<HTMLDivElement>(selectors.template);
		const list = basketElement.querySelector(selectors.basketList)!;
		list.innerHTML = '';

		basketElement.querySelector(
			selectors.basketPrice
		)!.textContent = `${basket.total} синапсов`;

		const orderBtn = basketElement.querySelector(
			selectors.orderButton
		) as HTMLButtonElement;
		if (orderBtn) {
			orderBtn.addEventListener('click', () => {
				this.events.emit('order:open', { total: basket.total });
			});
		}

		if (basket.products.length === 0) {
			const basketIsEmptyElement = document.createElement('span');
			basketIsEmptyElement.textContent = 'Корзина пуста';
			basketIsEmptyElement.classList.add('basket_empty');
            orderBtn.disabled = true;
			list.append(basketIsEmptyElement);
		}

		basket.products.forEach((product, index) => {
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
					this.events.emit('product:removeFromBasket', {
						id: product.id,
						fromBasket: true,
					});
				});
			}

			list.append(item);
		});

		this.showModal(basketElement);
	}
}
