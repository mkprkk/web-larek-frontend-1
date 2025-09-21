/**
 * Переводит строку из PascalCase или camelCase в kebab-case.
 * Пример: "MyClassName" -> "my-class-name"
 */
export function pascalToKebab(value: string): string {
    return value.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * Проверяет, что значение — это строка и её длина больше 1.
 * Используется, чтобы понять: передали ли нам селектор для querySelector.
 */
export function isSelector(x: any): x is string {
    return (typeof x === "string") && x.length > 1;
}

/**
 * Проверяет, что значение пустое (null или undefined).
 */
export function isEmpty(value: any): boolean {
    return value === null || value === undefined;
}

/**
 * Тип: коллекция селекторов.
 * Может быть строкой (CSS-селектор), NodeList или массивом элементов.
 */
export type SelectorCollection<T> = string | NodeListOf<Element> | T[];

/**
 * Превращает переданный селектор в массив DOM-элементов.
 * Принимает строку (CSS-селектор), NodeList или массив элементов.
 */
export function ensureAllElements<T extends HTMLElement>(selectorElement: SelectorCollection<T>, context: HTMLElement = document as unknown as HTMLElement): T[] {
    if (isSelector(selectorElement)) {
        return Array.from(context.querySelectorAll(selectorElement)) as T[];
    }
    if (selectorElement instanceof NodeList) {
        return Array.from(selectorElement) as T[];
    }
    if (Array.isArray(selectorElement)) {
        return selectorElement;
    }
    throw new Error(`Unknown selector element`);
}

/**
 * Тип: либо строка-селектор, либо сам элемент.
 */
export type SelectorElement<T> = T | string;

/**
 * Возвращает один элемент по селектору или сразу переданный элемент.
 * Если по селектору найдено несколько элементов — выдаёт предупреждение.
 * Если не найдено ни одного — кидает ошибку.
 */
export function ensureElement<T extends HTMLElement>(selectorElement: SelectorElement<T>, context?: HTMLElement): T {
    if (isSelector(selectorElement)) {
        const elements = ensureAllElements<T>(selectorElement, context);
        if (elements.length > 1) {
            console.warn(`selector ${selectorElement} return more then one element`);
        }
        if (elements.length === 0) {
            throw new Error(`selector ${selectorElement} return nothing`);
        }
        return elements.pop() as T;
    }
    if (selectorElement instanceof HTMLElement) {
        return selectorElement as T;
    }
    throw new Error('Unknown selector element');
}

/**
 * Клонирует содержимое HTML-шаблона (<template>) и возвращает первый элемент.
 * Удобно для генерации повторяющихся DOM-элементов (карточек и т.д.).
 */
export function cloneTemplate<T extends HTMLElement>(query: string | HTMLTemplateElement): T {
    const template = ensureElement(query) as HTMLTemplateElement;
    return template.content.firstElementChild.cloneNode(true) as T;
}

/**
 * Генератор BEM-имен классов.
 * block + __element + _modifier.
 * Возвращает объект с полным именем и селектором.
 * Пример: bem("button", "icon", "active") -> { name: "button__icon_active", class: ".button__icon_active" }
 */
export function bem(block: string, element?: string, modifier?: string): { name: string, class: string } {
    let name = block;
    if (element) name += `__${element}`;
    if (modifier) name += `_${modifier}`;
    return {
        name,
        class: `.${name}`
    };
}

/**
 * Возвращает список методов объекта (кроме конструктора).
 * Можно отфильтровать через функцию filter.
 */
export function getObjectProperties(obj: object, filter?: (name: string, prop: PropertyDescriptor) => boolean): string[] {
    return Object.entries(
        Object.getOwnPropertyDescriptors(
            Object.getPrototypeOf(obj)
        )
    )
        .filter(([name, prop]: [string, PropertyDescriptor]) => filter ? filter(name, prop) : (name !== 'constructor'))
        .map(([name]) => name);
}

/**
 * Устанавливает data-* атрибуты элементу.
 * Пример: setElementData(div, { id: 1 }) -> div.dataset.id = "1"
 */
export function setElementData<T extends Record<string, unknown> | object>(el: HTMLElement, data: T) {
    for (const key in data) {
        el.dataset[key] = String(data[key]);
    }
}

/**
 * Получает данные из dataset элемента и приводит их к нужным типам через схему.
 * Схема — объект с функциями-преобразователями.
 * Пример: getElementData(div, { id: Number }) -> { id: 123 }
 */
export function getElementData<T extends Record<string, unknown>>(el: HTMLElement, scheme: Record<string, Function>): T {
    const data: Partial<T> = {};
    for (const key in el.dataset) {
        data[key as keyof T] = scheme[key](el.dataset[key]);
    }
    return data as T;
}

/**
 * Проверка, что значение — это «обычный объект» (а не массив, класс, Date и т.п.).
 */
export function isPlainObject(obj: unknown): obj is object {
    const prototype = Object.getPrototypeOf(obj);
    return  prototype === Object.getPrototypeOf({}) ||
        prototype === null;
}

/**
 * Проверка: является ли значение булевым (true/false).
 */
export function isBoolean(v: unknown): v is boolean {
    return typeof v === 'boolean';
}

/**
 * Фабрика DOM-элементов (упрощённая).
 * - Создаёт элемент по имени тега.
 * - Устанавливает свойства (включая dataset).
 * - Добавляет детей.
 * Пример:
 * createElement("button", { innerText: "Click", dataset: { id: 5 } })
 */
export function createElement<
    T extends HTMLElement
    >(
    tagName: keyof HTMLElementTagNameMap,
    props?: Partial<Record<keyof T, string | boolean | object>>,
    children?: HTMLElement | HTMLElement []
): T {
    const element = document.createElement(tagName) as T;
    if (props) {
        for (const key in props) {
            const value = props[key];
            if (isPlainObject(value) && key === 'dataset') {
                setElementData(element, value);
            } else {
                // @ts-expect-error fix indexing later
                element[key] = isBoolean(value) ? value : String(value);
            }
        }
    }
    if (children) {
        for (const child of Array.isArray(children) ? children : [children]) {
            element.append(child);
        }
    }
    return element;
}
