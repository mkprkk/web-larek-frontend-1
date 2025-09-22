import { FormView } from '../../abstractions/formView';

const selectors = {
	template: 'order',
	radioButton: '.button_alt-radio',
	nextButton: '.order__button',
	errorContainer: '.form__errors',
};

export class OrderModalView extends FormView {
	render() {
		const form = this.cloneTemplate<HTMLFormElement>(selectors.template);

		const nextBtn = form.querySelector(
			selectors.nextButton
		) as HTMLButtonElement;

		nextBtn.addEventListener('click', () => {
			this.events.emit('contacts:open');
		});

		const errorContainer = form.querySelector(
			selectors.errorContainer
		) as HTMLSpanElement;

		const buttons = form.querySelectorAll(
			selectors.radioButton
		) as NodeListOf<HTMLInputElement>;

		buttons.forEach((btn) => {
			if (btn.checked) {
				this.handleInputValidation(
					btn,
					errorContainer,
					nextBtn,
					form,
					'order:payment'
				);
			}
			
			btn.addEventListener('click', () => {
				this.handleInputValidation(
					btn,
					errorContainer,
					nextBtn,
					form,
					'order:payment'
				);
			});
		});

		const addressInput = form.querySelector(
			'[name="address"]'
		) as HTMLInputElement;

		addressInput.addEventListener('input', () => {
			this.handleInputValidation(
				addressInput,
				errorContainer,
				nextBtn,
				form,
				'order:address'
			);
		});

		this.showModal(form);
	}
}
