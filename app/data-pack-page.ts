import { EventData, Page, Dialogs, View } from '@nativescript/core';
import { LanguageService } from './services/language.service';

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    const languageService = new LanguageService();
    page.bindingContext = {
        translate: (key: string, params?: { [key: string]: string }) => languageService.translate(key, params),
        dataPacks: [
            { name: languageService.translate('data_pack_1'), price: 'Rs. 100' },
            { name: languageService.translate('data_pack_2'), price: 'Rs. 200' },
            { name: languageService.translate('data_pack_3'), price: 'Rs. 300' }
        ]
    };
}

export function onDataPackTap(args: EventData) {
    const view = <View>args.object;
    const selectedDataPack = view.bindingContext;
    const languageService = new LanguageService();
    const translate = (key: string, params?: { [key: string]: string }) => languageService.translate(key, params);

    Dialogs.alert({
        title: translate('purchase_successful'),
        message: translate('purchase_message', { name: selectedDataPack.name, price: selectedDataPack.price }),
        okButtonText: translate('ok')
    });
}