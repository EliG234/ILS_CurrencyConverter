import {
  registerWidgetTaskHandler,
  type WidgetTaskHandler,
} from 'react-native-android-widget';

import { ILSRateWidget } from './ILSRateWidget';
import { adjustWidgetAmount, readWidgetAmountText, parseWidgetAmount } from '../amount';
import { fetchWidgetRates, type WidgetRates } from '../rates';

function getRatesFromClickActionData(
  data?: Record<string, unknown>,
): Omit<WidgetRates, 'amount'> | null {
  if (
    typeof data?.usdToIls !== 'number' ||
    !Number.isFinite(data.usdToIls) ||
    typeof data.eurToIls !== 'number' ||
    !Number.isFinite(data.eurToIls) ||
    typeof data.updatedAt !== 'string' ||
    typeof data.rateDate !== 'string'
  ) {
    return null;
  }

  return {
    usdToIls: data.usdToIls,
    eurToIls: data.eurToIls,
    updatedAt: data.updatedAt,
    rateDate: data.rateDate,
  };
}

export const widgetTaskHandler: WidgetTaskHandler = async ({
  widgetAction,
  clickAction,
  clickActionData,
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
    let amountText = await readWidgetAmountText();

    if (widgetAction === 'WIDGET_CLICK') {
      if (clickAction === 'INCREASE_AMOUNT') {
        amountText = await adjustWidgetAmount('increase');
      } else if (clickAction === 'DECREASE_AMOUNT') {
        amountText = await adjustWidgetAmount('decrease');
      } else {
        return;
      }

      const cachedRates = getRatesFromClickActionData(clickActionData);
      const amount = parseWidgetAmount(amountText) ?? 1;
      if (cachedRates) {
        renderWidget(<ILSRateWidget rates={{ ...cachedRates, amount }} />);
        return;
      }
    }

    const amount = parseWidgetAmount(amountText) ?? 1;
    const rates = await fetchWidgetRates(amount);
    renderWidget(<ILSRateWidget rates={rates} />);
  } catch (cause) {
    console.warn('Unable to load rates for the Android widget.', cause);
    renderWidget(<ILSRateWidget error />);
  }
};

registerWidgetTaskHandler(widgetTaskHandler);