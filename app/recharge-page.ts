import { EventData, Page, TextField, Dialogs } from '@nativescript/core';
import { LanguageService } from './services/language.service';

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    const languageService = new LanguageService();

    page.bindingContext = {
        translate: (key: string, params?: { [key: string]: string }) => languageService.translate(key, params),
        onRechargeTap: (event: EventData) => onRechargeTap(event, languageService)
    };
}

export function onRechargeTap(args: EventData, languageService: LanguageService) {
    const page = <Page>(<any>args.object).page;
    const translate = (key: string, params?: { [key: string]: string }) => languageService.translate(key, params);

    const numberField = <TextField>page.getViewById('numberField');
    const amountField = <TextField>page.getViewById('amountField');

    const phoneNumber = numberField?.text?.trim();
    const amount = amountField?.text?.trim();

    if (!phoneNumber || !/^[6-9]\d{9}$/.test(phoneNumber)) {
        Dialogs.alert({
            title: translate('recharge'),
            message: translate('invalid_number'),
            okButtonText: translate('ok')
        });
        return;
    }

    if (!amount || !/^\d+$/.test(amount) || parseInt(amount) <= 0) {
        Dialogs.alert({
            title: translate('recharge'),
            message: translate('invalid_amount'),
            okButtonText: translate('ok')
        });
        return;
    }

    Dialogs.alert({
        title: translate('recharge_successful'),
        message: translate('recharge_message', { number: phoneNumber, amount: `Rs. ${amount}` }),
        okButtonText: translate('ok')
    });
}
