import { BaseView } from './baseVIew';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

const selectors = {
	template: 'card-catalog',
	container: '.gallery',
	title: '.card__title',
	price: '.card__price',
	category: '.card__category',
	image: '.card__image',
};

export class GalleryView extends BaseView {
	private container: HTMLElement;

	constructor(events: IEvents) {
		super(events);
		this.container = ensureElement(selectors.container);
	}

	render(products: IProduct[]) {
		this.container.innerHTML = '';
		products.forEach((product) => {
			const card = this.cloneTemplate<HTMLButtonElement>(selectors.template);

			card.querySelector(selectors.title)!.textContent = product.title;
			card.querySelector(selectors.price)!.textContent = product.price
				? `${product.price} синапсов`
				: 'Бесценно';
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
			
			(card.querySelector(selectors.image) as HTMLImageElement).src =
				product.image;
			card.dataset.id = product.id;

			card.addEventListener('click', () => {
				this.events.emit('product:clicked', { id: product.id });
			});

			this.container.append(card);
		});
	}
}
