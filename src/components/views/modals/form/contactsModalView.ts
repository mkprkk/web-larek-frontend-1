import { FormView } from '../../abstractions/formView';

const selectors = {
    template: 'contacts',
    formSubmit: '.order__button',
    errorContainer: '.form__errors',
};

export class ContactsModalView extends FormView {
    render() {
        const form = this.cloneTemplate<HTMLFormElement>(selectors.template);
        
        const submitBtn = form.querySelector(
            selectors.formSubmit
        ) as HTMLButtonElement;

        const emailInput = form.querySelector('[name="email"]') as HTMLInputElement;
        const phoneInput = form.querySelector('[name="phone"]') as HTMLInputElement;
        const errorContainer = form.querySelector(
            selectors.errorContainer
        ) as HTMLSpanElement;

        submitBtn.addEventListener('click', () => {
            this.events.emit('contacts:submit');
        })

        // Обработчик для форматирования телефона
        phoneInput.addEventListener('input', (e) => {
            this.formatPhoneNumber(phoneInput);
            this.handleInputValidation(
                phoneInput,
                errorContainer,
                submitBtn,
                form,
                'contacts:phone'
            );
        });

        // Запрет ввода букв и специальных символов
        phoneInput.addEventListener('keydown', (e) => {
            this.restrictPhoneInput(e);
        });

        emailInput.addEventListener('input', () => {
            this.handleInputValidation(
                emailInput,
                errorContainer,
                submitBtn,
                form,
                'contacts:email'
            );
        });

        this.showModal(form);
    }

    // Метод для ограничения ввода
    private restrictPhoneInput(e: KeyboardEvent): void {
        // Разрешаем: цифры, Backspace, Delete, Tab, стрелки
        const allowedKeys = [
            'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 
            'ArrowUp', 'ArrowDown'
        ];
        
        if (allowedKeys.includes(e.key)) {
            return;
        }

        // Запрещаем все, кроме цифр
        if (!/^\d$/.test(e.key)) {
            e.preventDefault();
        }
    }

    // Метод для форматирования номера телефона
    private formatPhoneNumber(input: HTMLInputElement): void {
        let value = input.value.replace(/\D/g, ''); // Удаляем все нецифровые символы
        
        // Если номер начинается не с 7, добавляем +7
        if (!value.startsWith('7') && value.length > 0) {
            value = '7' + value;
        }
        
        // Ограничиваем длину до 11 цифр (включая первую 7)
        if (value.length > 11) {
            value = value.substring(0, 11);
        }
        
        // Форматируем номер
        let formattedValue = '+7 (';
        
        if (value.length > 1) {
            formattedValue += value.substring(1, 4);
        }
        
        if (value.length > 4) {
            formattedValue += ') ' + value.substring(4, 7);
        }
        
        if (value.length > 7) {
            formattedValue += '-' + value.substring(7, 9);
        }
        
        if (value.length > 9) {
            formattedValue += '-' + value.substring(9, 11);
        }
        
        // Убираем лишние символы в конце
        formattedValue = formattedValue.replace(/[^\d\+\(\)\s\-]$/, '');
        
        input.value = formattedValue;
        
        // Устанавливаем курсор в конец
        setTimeout(() => {
            input.setSelectionRange(formattedValue.length, formattedValue.length);
        }, 0);
    }
}