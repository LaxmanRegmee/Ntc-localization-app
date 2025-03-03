import { EventData, Observable, Page } from '@nativescript/core';

export class PopupBannerViewModel extends Observable {
    constructor(private page: Page) {
        super();
    }

    onClose(args: EventData) {
        this.page.closeModal();
    }
}