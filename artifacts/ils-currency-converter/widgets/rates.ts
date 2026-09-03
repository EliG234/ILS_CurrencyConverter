export type WidgetRates = {
  usdToIls: number;
  eurToIls: number;
  updatedAt: string;
};

function getApiBaseUrl() {
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  if (!domain) {
    throw new Error('EXPO_PUBLIC_DOMAIN is not configured for widget updates.');
  }
  return `https://${domain}`;
}

export async function fetchWidgetRates(): Promise<WidgetRates> {
  const response = await fetch(`${getApiBaseUrl()}/api/rates`);
  if (!response.ok) {
    throw new Error(`Rates request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as Partial<WidgetRates> & {
    date?: string;
  };
  const updatedAt = payload.updatedAt ?? payload.date;
  if (
    typeof payload.usdToIls !== 'number' ||
    typeof payload.eurToIls !== 'number' ||
    typeof updatedAt !== 'string'
  ) {
    throw new Error('Rates response did not contain the expected values.');
  }

  return {
    usdToIls: payload.usdToIls,
    eurToIls: payload.eurToIls,
    updatedAt,
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