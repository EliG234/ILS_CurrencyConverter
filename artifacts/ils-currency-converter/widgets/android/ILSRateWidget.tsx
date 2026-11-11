"use no memo";

import {
  FlexWidget,
  TextWidget,
  type ColorProp,
  type WidgetInfo,
} from 'react-native-android-widget';
import type { ReactElement } from 'react';

import {
  formatWidgetDate,
  formatWidgetRate,
  formatWidgetTime,
  type WidgetRates,
} from '../rates';

const palette = {
  background: 'rgba(16, 42, 67, 0.94)' as ColorProp,
  surface: 'rgba(38, 72, 101, 0.74)' as ColorProp,
  text: '#FFFFFF' as ColorProp,
  muted: '#A9C1D3' as ColorProp,
  mint: '#8FE3CF' as ColorProp,
  usd: '#72B7FF' as ColorProp,
  usdBadge: 'rgba(114, 183, 255, 0.16)' as ColorProp,
  eur: '#FFC66D' as ColorProp,
  eurBadge: 'rgba(255, 198, 109, 0.16)' as ColorProp,
  error: '#FFB4AB' as ColorProp,
} as const;

function HorizontalRateCard({
  currency,
  symbol,
  rate,
  accent,
  accentBadge,
}: {
  currency: 'USD' | 'EUR';
  symbol: string;
  rate: number;
  accent: ColorProp;
  accentBadge: ColorProp;
}) {
  return (
    <FlexWidget
      style={{
        flex: 1,
        backgroundColor: palette.surface,
        borderRadius: 12,
        paddingHorizontal: 7,
        paddingVertical: 7,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
        <FlexWidget
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            backgroundColor: accentBadge,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TextWidget
            text={symbol}
            style={{ color: accent, fontSize: 12, fontWeight: 'bold' }}
          />
        </FlexWidget>
        <TextWidget
          text={currency}
          style={{
            color: palette.text,
            fontSize: 12,
            fontWeight: 'bold',
            marginLeft: 4,
          }}
        />
      </FlexWidget>

      <TextWidget
        text={formatWidgetRate(rate)}
        style={{
          color: palette.text,
          fontSize: 14,
          fontWeight: 'bold',
        }}
      />
    </FlexWidget>
  );
}

function VerticalRateCard({
  currency,
  symbol,
  rate,
  accent,
  accentBadge,
}: {
  currency: 'USD' | 'EUR';
  symbol: string;
  rate: number;
  accent: ColorProp;
  accentBadge: ColorProp;
}) {
  return (
    <FlexWidget
      style={{
        width: 'match_parent',
        backgroundColor: palette.surface,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
        <FlexWidget
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            backgroundColor: accentBadge,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TextWidget
            text={symbol}
            style={{ color: accent, fontSize: 14, fontWeight: 'bold' }}
          />
        </FlexWidget>
        <FlexWidget style={{ marginLeft: 8 }}>
          <TextWidget
            text={currency}
            style={{ color: palette.text, fontSize: 13, fontWeight: 'bold' }}
          />
          <TextWidget
            text="to ILS"
            style={{ color: palette.muted, fontSize: 10, marginTop: 1 }}
          />
        </FlexWidget>
      </FlexWidget>

      <TextWidget
        text={formatWidgetRate(rate)}
        style={{ color: palette.text, fontSize: 17, fontWeight: 'bold' }}
      />
    </FlexWidget>
  );
}

export function ILSRateWidget({
  rates,
  error,
  widgetInfo,
}: {
  rates?: WidgetRates;
  error?: boolean;
  widgetInfo?: WidgetInfo;
}): ReactElement {
  const height = widgetInfo?.height ?? 60;

  // In Android AppWidgetManager, OPTION_APPWIDGET_MAX_HEIGHT is ~100dp for 1-row (3x1)
  // and ~180dp for 2-row (3x2/2x2).
  const isTall = height >= 115;

  return (
    <FlexWidget
      accessibilityLabel="Live US dollar and euro exchange rates to Israeli shekels"
      clickAction="OPEN_APP"
      style={{
        backgroundColor: palette.background,
        borderRadius: isTall ? 24 : 18,
        paddingHorizontal: isTall ? 14 : 8,
        paddingVertical: isTall ? 12 : 6,
        width: 'match_parent',
        height: 'match_parent',
        justifyContent: 'space-between',
      }}
    >
      <FlexWidget
        style={{
          width: 'match_parent',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: isTall ? 8 : 4,
        }}
      >
        <TextWidget
          text="ILS RATES"
          style={{
            color: palette.mint,
            fontSize: isTall ? 11 : 10,
            fontWeight: 'bold',
            letterSpacing: 1,
          }}
        />
        <TextWidget
          text="LIVE"
          style={{
            backgroundColor: palette.surface,
            borderRadius: 6,
            color: palette.mint,
            fontSize: isTall ? 9 : 8,
            fontWeight: 'bold',
            paddingHorizontal: isTall ? 7 : 5,
            paddingVertical: isTall ? 3 : 2,
          }}
        />
      </FlexWidget>

      {error ? (
        <FlexWidget style={{ flex: 1, width: 'match_parent', justifyContent: 'center' }}>
          <TextWidget
            text="Unable to update rates"
            style={{
              color: palette.error,
              fontSize: 14,
              fontWeight: 'bold',
            }}
          />
          <TextWidget
            text="Open app to refresh"
            style={{
              color: palette.muted,
              fontSize: 10,
              marginTop: 4,
            }}
          />
        </FlexWidget>
      ) : rates ? (
        <FlexWidget
          style={{
            flex: 1,
            width: 'match_parent',
            flexDirection: isTall ? 'column' : 'row',
            flexGap: isTall ? 8 : 5,
            justifyContent: 'center',
          }}
        >
          {isTall ? [
            <VerticalRateCard
              key="usd"
              currency="USD"
              symbol="$"
              rate={rates.usdToIls}
              accent={palette.usd}
              accentBadge={palette.usdBadge}
            />,
            <VerticalRateCard
              key="eur"
              currency="EUR"
              symbol="€"
              rate={rates.eurToIls}
              accent={palette.eur}
              accentBadge={palette.eurBadge}
            />,
          ] : [
            <HorizontalRateCard
              key="usd"
              currency="USD"
              symbol="$"
              rate={rates.usdToIls}
              accent={palette.usd}
              accentBadge={palette.usdBadge}
            />,
            <HorizontalRateCard
              key="eur"
              currency="EUR"
              symbol="€"
              rate={rates.eurToIls}
              accent={palette.eur}
              accentBadge={palette.eurBadge}
            />,
          ]}
        </FlexWidget>
      ) : (
        <FlexWidget style={{ flex: 1, width: 'match_parent', justifyContent: 'center' }}>
          <TextWidget
            text="Loading live rates…"
            style={{ color: palette.text, fontSize: 14, fontWeight: 'bold' }}
          />
        </FlexWidget>
      )}

      {isTall && rates && !error && (
        <FlexWidget
          style={{
            width: 'match_parent',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 6,
          }}
        >
          <TextWidget
            text={`Updated ${formatWidgetTime(rates.updatedAt)}`}
            style={{ color: palette.muted, fontSize: 9 }}
          />
          <TextWidget
            text={`Rate date: ${formatWidgetDate(rates.rateDate)}`}
            style={{ color: palette.muted, fontSize: 9 }}
          />
        </FlexWidget>
      )}
    </FlexWidget>
  );
}
