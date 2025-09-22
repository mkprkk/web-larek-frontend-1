import { BaseView } from '../abstractions/baseVIew';
import { IEvents } from '../../base/events';

const selectors = {
    button: '.header__basket',
    counter: '.header__basket-counter',
}

export class HeaderBasketView extends BaseView {
	private counter: HTMLElement;
	private button: HTMLElement;

	constructor(events: IEvents) {
		super(events);
		this.button = this.ensureElement(selectors.button);
        this.counter = this.ensureElement(selectors.counter);
		this.button.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

    render(counter: string) {
        this.counter.textContent = counter;
    }
}
