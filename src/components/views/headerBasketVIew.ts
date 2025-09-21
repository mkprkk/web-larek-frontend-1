import { BaseView } from './baseVIew';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

const selectors = {
    button: '.header__basket',
    counter: '.header__basket-counter',
}

export class HeaderBasketView extends BaseView {
	private counter: HTMLElement;
	private button: HTMLElement;

	constructor(events: IEvents) {
		super(events);
		this.button = ensureElement(selectors.button);
        this.counter = ensureElement(selectors.counter);
		this.button.addEventListener('click', () => {
			this.events.emit('cart:open');
		});
	}

    render(counter: string) {
        this.counter.textContent = counter;
    }
}
