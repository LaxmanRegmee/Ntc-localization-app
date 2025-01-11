import { EventData, Observable, Page, View } from '@nativescript/core';

export class CustomDialogViewModel extends Observable {
    constructor(private page: Page, private params: { title: string, message: string }) {
        super();
        this.set('title', params.title);
        this.set('message', params.message);
    }

    onClose(args: EventData) {
        this.page.closeModal();
    }
}