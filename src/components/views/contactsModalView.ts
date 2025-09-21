import { ModalView } from "./modalVIew";

const selectors = {
    template: 'contacts',
    formSubmit: '.form__submit',
}

export class ContactsModalView extends ModalView {
    render() {
        const form = this.cloneTemplate<HTMLFormElement>(selectors.template);
        const submitBtn = form.querySelector(selectors.formSubmit) as HTMLButtonElement;
        if (submitBtn) {
            submitBtn.addEventListener('click', (event) => {
                event.preventDefault();
                const emailInput = form.querySelector(
                    '[name="email"]'
                ) as HTMLInputElement;
                const phoneInput = form.querySelector(
                    '[name="phone"]'
                ) as HTMLInputElement;
                this.events.emit('contacts:submit', {
                    email: emailInput.value,
                    phone: phoneInput.value,
                });
            });
        }

        this.showModal(form);
    }
}