import { IEvents } from "../base/events";
import { cloneTemplate, ensureElement } from "../../utils/utils";

export abstract class BaseView {
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    protected cloneTemplate<T extends HTMLElement>(templateId: string): T {
        return cloneTemplate<T>(`#${templateId}`);
    }

    protected ensureElement<T extends HTMLElement>(
        selector: string,
        context?: HTMLElement
    ): T {
        return ensureElement<T>(selector, context);
    }
}