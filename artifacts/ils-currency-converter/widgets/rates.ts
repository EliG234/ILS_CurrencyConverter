export type WidgetRates = {
  usdToIls: number;
  eurToIls: number;
  updatedAt: string;
  rateDate: string;
  amount: number;
};

function getApiBaseUrl() {
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  if (!domain) {
    throw new Error('EXPO_PUBLIC_DOMAIN is not configured for widget updates.');
  }
  return `https://${domain}`;
}

export async function fetchWidgetRates(amount = 1): Promise<WidgetRates> {
  const response = await fetch(`${getApiBaseUrl()}/api/rates`);
  if (!response.ok) {
    throw new Error(`Rates request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as Partial<WidgetRates> & {
    date?: string;
  };
  const rateDate = payload.rateDate ?? payload.date;
  if (
    typeof payload.usdToIls !== 'number' ||
    typeof payload.eurToIls !== 'number' ||
    typeof rateDate !== 'string'
  ) {
    throw new Error('Rates response did not contain the expected values.');
  }

  return {
    usdToIls: payload.usdToIls,
    eurToIls: payload.eurToIls,
    updatedAt: new Date().toISOString(),
    rateDate,
    amount,
  };
}

export function formatWidgetRate(value: number) {
  return `₪${value.toFixed(2)}`;
}

export function formatWidgetTime(updatedAt: string) {
  return new Date(updatedAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatWidgetDate(rateDate: string) {
  const [year, month, day] = rateDate.split('-').map(Number);
  if (!year || !month || !day) return rateDate;

  return new Intl.DateTimeFormat([], {
    day: 'numeric',
    month: 'short',
  }).format(new Date(year, month - 1, day));
}

export function formatWidgetAmount(amount: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(amount);
}