import {
  registerWidgetTaskHandler,
  type WidgetTaskHandler,
} from 'react-native-android-widget';

import { ILSRateWidget } from './ILSRateWidget';
import { fetchWidgetRates } from '../rates';

export const widgetTaskHandler: WidgetTaskHandler = async ({
  widgetInfo,
  widgetAction,
  renderWidget,
}) => {
  if (
    widgetAction !== 'WIDGET_ADDED' &&
    widgetAction !== 'WIDGET_UPDATE' &&
    widgetAction !== 'WIDGET_RESIZED' &&
    widgetAction !== 'WIDGET_CLICK'
  ) {
    return;
  }

  try {
    const rates = await fetchWidgetRates();
    renderWidget(<ILSRateWidget rates={rates} widgetInfo={widgetInfo} />);
  } catch (cause) {
    console.warn('Unable to load rates for the Android widget.', cause);
    renderWidget(<ILSRateWidget error widgetInfo={widgetInfo} />);
  }
};

registerWidgetTaskHandler(widgetTaskHandler);
