export type WidgetRates = {
  usdToIls: number;
  eurToIls: number;
  updatedAt: string;
  rateDate: string;
  amount: number;
};

const FRANKFURTER_URL = 'https://api.frankfurter.dev/v1/latest?to=USD,ILS';

export async function fetchLiveRatesFromFrankfurter(): Promise<{
  usdToIls: number;
  eurToIls: number;
  date: string;
}> {
  const response = await fetch(FRANKFURTER_URL);
  if (!response.ok) {
    throw new Error(`Frankfurter rates request failed with status ${response.status}.`);
  }

  const data = (await response.json()) as {
    date?: string;
    rates?: {
      USD?: number;
      ILS?: number;
    };
  };

  const eurToUsd = data.rates?.USD;
  const eurToIls = data.rates?.ILS;

  if (
    typeof eurToUsd !== 'number' ||
    typeof eurToIls !== 'number' ||
    typeof data.date !== 'string' ||
    eurToUsd <= 0
  ) {
    throw new Error('Frankfurter response did not contain expected values.');
  }

  return {
    usdToIls: eurToIls / eurToUsd,
    eurToIls,
    date: data.date,
  };
}

function getApiBaseUrl(): string | null {
  const domain = process.env.EXPO_PUBLIC_DOMAIN?.trim();
  if (!domain) return null;
  const cleaned = domain.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
  return cleaned ? `https://${cleaned}` : null;
}

export async function fetchWidgetRates(amount = 1): Promise<WidgetRates> {
  let rateData: { usdToIls: number; eurToIls: number; date: string } | null = null;

  const baseUrl = getApiBaseUrl();
  if (baseUrl) {
    try {
      const response = await fetch(`${baseUrl}/api/rates`);
      if (response.ok) {
        const text = await response.text();
        if (!text.trim().startsWith('<')) {
          const payload = JSON.parse(text) as Record<string, unknown>;
          const rateDate = (payload.rateDate ?? payload.date) as string | undefined;
          if (
            typeof payload.usdToIls === 'number' &&
            Number.isFinite(payload.usdToIls) &&
            typeof payload.eurToIls === 'number' &&
            Number.isFinite(payload.eurToIls) &&
            typeof rateDate === 'string'
          ) {
            rateData = {
              usdToIls: payload.usdToIls,
              eurToIls: payload.eurToIls,
              date: rateDate,
            };
          }
        }
      }
    } catch {
      // Fall through to direct Frankfurter fetch
    }
  }

  if (!rateData) {
    rateData = await fetchLiveRatesFromFrankfurter();
  }

  return {
    usdToIls: rateData.usdToIls,
    eurToIls: rateData.eurToIls,
    updatedAt: new Date().toISOString(),
    rateDate: rateData.date,
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
