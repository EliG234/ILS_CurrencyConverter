import { ILSRateWidget } from './ILSRateWidget';
import type { WidgetRates } from '../rates';

export function updateIosRateWidget(rates: WidgetRates) {
  ILSRateWidget.updateSnapshot(rates);
}