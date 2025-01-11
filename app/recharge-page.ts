import { EventData, Page, TextField, Dialogs, Frame } from '@nativescript/core';
import { LanguageService } from './services/language.service';
import { CustomDialogViewModel } from './custom-dialog';

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
        page.showModal(
            'app/custom-dialog',
            {
                context: { 
                    title: translate('recharge_successful'), 
                    message: translate('recharge_message', { number, amount }) 
                },
                closeCallback: () => { }
            }
        );
    } else {
        Dialogs.alert({
            title: translate('error'),
            message: translate('enter_number_and_amount'),
            okButtonText: translate('ok')
        });
    }
}