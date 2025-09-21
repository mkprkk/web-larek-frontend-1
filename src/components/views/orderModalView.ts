import { ModalView } from "./modalVIew";

const selectors = {
    template: 'order',
    radioButton: '.button_alt-radio', 
    sumbitButton: '.form__submit',
}

export class OrderModalView extends ModalView {
    render() {
        const form = this.cloneTemplate<HTMLFormElement>('order');
        const buttons = form.querySelectorAll(
            selectors.radioButton
        ) as NodeListOf<HTMLInputElement>;
        buttons.forEach((btn) => {
            btn.addEventListener('click', () => {
                this.events.emit('order:paymentSelected', { payment: btn.value });
            });
        });

        const nextBtn = form.querySelector(selectors.sumbitButton) as HTMLButtonElement;
        if (nextBtn) {
            nextBtn.addEventListener('click', (event) => {
                event.preventDefault();
                const addressInput = form.querySelector(
                    '[name="address"]'
                ) as HTMLInputElement;
                this.events.emit('order:submit', { address: addressInput.value });
            });
        }

        this.showModal(form);
    }
}