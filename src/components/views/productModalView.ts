import { ModalView } from './modalVIew';

const selectors = {
	template: 'card-preview',
	title: '.card__title',
	text: '.card__text',
	category: '.card__category',
	image: '.card__image',
	price: '.card__price',
	button: '.card__button',
};

export class ProductModalView extends ModalView {
	render(product: IProduct, inCart: boolean) {
		const card = this.cloneTemplate<HTMLDivElement>(selectors.template);

		card.querySelector(selectors.title)!.textContent = product.title;
		card.querySelector(selectors.text)!.textContent = product.description;
		card.querySelector(selectors.category)!.textContent = product.category;
		const categoryElement = card.querySelector(
			selectors.category
		) as HTMLSpanElement;
		categoryElement!.textContent = product.category;

		switch (product.category) {
			case 'софт-скил':
				categoryElement.classList.add('card__category_soft');
				break;
			case 'другое':
				categoryElement.classList.add('card__category_other');
				break;
			case 'дополнительное':
				categoryElement.classList.add('card__category_additional');
				break;
			case 'кнопка':
				categoryElement.classList.add('card__category_button');
				break;
			case 'хард-скил':
				categoryElement.classList.add('card__category_hard');
				break;
		}
		(card.querySelector(selectors.image) as HTMLImageElement)!.src =
			product.image;
		card.querySelector(selectors.price)!.textContent = product.price
			? `${product.price} синапсов`
			: 'Бесценно';

		const btn = card.querySelector(selectors.button) as HTMLButtonElement;
		if (product.price) {
			btn.textContent = inCart ? 'Удалить из корзины' : 'В корзину';
		} else {
			btn.textContent = 'Недоступно';
			btn.disabled = true;
		}
		btn.addEventListener('click', () => {
			this.events.emit(
				inCart ? 'product:removeFromCart' : 'product:addToCart',
				{
					id: product.id,
				}
			);
			if (inCart) {
				this.hideModal();
			}
		});

		this.showModal(card);
	}
}
