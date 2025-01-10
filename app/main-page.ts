import { EventData, Page, Frame } from '@nativescript/core';
import { HelloWorldModel } from './main-view-model';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new HelloWorldModel();
}

export function onRechargeTap(args: EventData) {
  const frame = Frame.topmost();
  frame.navigate("recharge-page");
}
