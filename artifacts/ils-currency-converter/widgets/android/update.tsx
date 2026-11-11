import { requestWidgetUpdate, type WidgetInfo } from 'react-native-android-widget';

import { ILSRateWidget } from './ILSRateWidget';
import type { WidgetRates } from '../rates';

export async function updateAndroidRateWidget(rates: WidgetRates) {
  await requestWidgetUpdate({
    widgetName: 'ILSRateWidget',
    renderWidget: (widgetInfo: WidgetInfo) => (
      <ILSRateWidget rates={rates} widgetInfo={widgetInfo} />
    ),
  });
}
