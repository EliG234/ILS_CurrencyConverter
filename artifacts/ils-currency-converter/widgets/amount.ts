import AsyncStorage from '@react-native-async-storage/async-storage';

const WIDGET_AMOUNT_KEY = '@ils-currency-converter/widget-amount';
export const DEFAULT_WIDGET_AMOUNT = '1';

export function parseWidgetAmount(text: string): number | null {
  if (!text.trim()) return null;
  const amount = Number(text);
  return Number.isFinite(amount) && amount >= 0 ? amount : null;
}

export async function readWidgetAmountText(): Promise<string> {
  const storedAmount = await AsyncStorage.getItem(WIDGET_AMOUNT_KEY);
  return storedAmount !== null && parseWidgetAmount(storedAmount) !== null
    ? storedAmount
    : DEFAULT_WIDGET_AMOUNT;
}

export async function saveWidgetAmountText(text: string): Promise<void> {
  if (parseWidgetAmount(text) === null) return;
  await AsyncStorage.setItem(WIDGET_AMOUNT_KEY, text);
}

export async function adjustWidgetAmount(
  direction: 'increase' | 'decrease',
): Promise<string> {
  const currentText = await readWidgetAmountText();
  const currentAmount = parseWidgetAmount(currentText) ?? 1;
  const delta = direction === 'increase' ? 1 : -1;
  const nextAmount = Math.max(0, Math.round((currentAmount + delta) * 100) / 100);
  const nextText = String(nextAmount);
  await saveWidgetAmountText(nextText);
  return nextText;
}
