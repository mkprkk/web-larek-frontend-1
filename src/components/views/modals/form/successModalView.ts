import { FormView } from '../../abstractions/formView';

const selectors = {
	template: 'success',
	sucessDescription: '.order-success__description',
	closeButton: '.order-success__close',
};

export class SuccessModalView extends FormView {
	render(total: number) {
		const success = this.cloneTemplate<HTMLDivElement>(selectors.template);
		success.querySelector(
			selectors.sucessDescription
		)!.textContent = `Списано ${total} синапсов`;

		const closeBtn = success.querySelector(
			selectors.closeButton
		) as HTMLButtonElement;
		if (closeBtn) {
			closeBtn.addEventListener('click', () => {
				this.events.emit('success:close');
				this.hideModal();
			});
		}

		this.showModal(success);
	}
}
