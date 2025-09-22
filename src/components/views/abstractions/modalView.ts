import { BaseView } from './baseVIew';
import { IEvents } from '../../base/events';

const selectors = {
	modalSelector: '#modal-container',
	closeButton: '.modal__close',
	modalContent: '.modal__content',
};

export abstract class ModalView extends BaseView {
	protected modalContainer: HTMLElement;

	constructor(
		events: IEvents,
		modalSelector: string = selectors.modalSelector
	) {
		super(events);
		this.modalContainer = this.ensureElement<HTMLElement>(modalSelector);

		const closeBtn = this.modalContainer.querySelector(selectors.closeButton);
		if (closeBtn) {
			closeBtn.addEventListener('click', () => this.hideModal());
		}

		this.modalContainer.addEventListener('click', (event) => {
			if (event.target === this.modalContainer) {
				this.hideModal();
			}
		});

		document.addEventListener('keyup', (event) => {
			if (event.key === 'Escape') {
				this.hideModal();
			}
		});
	}

	protected showModal(content: HTMLElement) {
		const contentBox = this.ensureElement<HTMLElement>(
			selectors.modalContent,
			this.modalContainer
		);
		contentBox.innerHTML = '';
		contentBox.append(content);

		this.modalContainer.classList.add('modal_active');
	}

	protected hideModal() {
		this.modalContainer.classList.remove('modal_active');
	}
}
