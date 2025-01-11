import { EventData, Page, TextField, Dialogs } from '@nativescript/core';
import { LanguageService } from './services/language.service';

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    const languageService = new LanguageService();
    page.bindingContext = {
        translate: (key: string, params?: { [key: string]: string }) => languageService.translate(key, params)
    };
}

export function onRechargeTap(args: EventData) {
    const page = <Page>(<any>args.object).page;
    const numberField = <TextField>page.getViewById("numberField");
    const amountField = <TextField>page.getViewById("amountField");

    const number = numberField.text;
    const amount = amountField.text;

    const languageService = new LanguageService();
    const translate = (key: string, params?: { [key: string]: string }) => languageService.translate(key, params);

    if (number && amount) {
        Dialogs.alert({
            title: translate('recharge_successful'),
            message: translate('recharge_message', { number, amount }),
            okButtonText: translate('ok')
        });
    } else {
        Dialogs.alert({
            title: translate('error'),
            message: translate('enter_number_and_amount'),
            okButtonText: translate('ok')
        });
    }
}