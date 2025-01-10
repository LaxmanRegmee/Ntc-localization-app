import { EventData, Page } from '@nativescript/core';

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    // You can set the binding context or any other initialization here
}

export function onRechargeTap(args: EventData) {
    // Handle the recharge logic here
    console.log("Recharge button tapped");
}