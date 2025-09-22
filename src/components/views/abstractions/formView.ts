import { ModalView } from './modalView';

export abstract class FormView extends ModalView {
	private buttonGate(btn: HTMLButtonElement, form: HTMLFormElement) {
		if (form.checkValidity()) {
			btn.disabled = false;
		} else {
			btn.disabled = true;
		}
	}

	protected handleInputValidation(
		input: HTMLInputElement,
		errorContainer: HTMLSpanElement,
		btn: HTMLButtonElement,
		form: HTMLFormElement,
		eventName: string
	) {
		if (!input.validity.valid) {
			errorContainer.textContent = input.dataset.errorMessage;
		} else {
			errorContainer.textContent = '';
			this.events.emit(eventName, { [input.name]: input.value });
		}
		this.buttonGate(btn, form);
	}
}
