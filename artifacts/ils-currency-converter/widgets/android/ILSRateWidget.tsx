"use no memo";

import {
  FlexWidget,
  TextWidget,
} from 'react-native-android-widget';
import type { ReactElement } from 'react';

import {
  formatWidgetAmount,
  formatWidgetDate,
  formatWidgetRate,
  formatWidgetTime,
  type WidgetRates,
} from '../rates';

const palette = {
  background: 'rgba(16, 42, 67, 0.84)',
  surface: 'rgba(38, 72, 101, 0.74)',
  control: 'rgba(14, 35, 54, 0.82)',
  text: '#FFFFFF',
  muted: '#A9C1D3',
  mint: '#8FE3CF',
  usd: '#72B7FF',
  eur: '#FFC66D',
  divider: '#41627A',
  error: '#FFB4AB',
} as const;

function ConversionRow({
  amount,
  currency,
  rate,
  accent,
}: {
  amount: number;
  currency: 'USD' | 'EUR';
  rate: number;
  accent: typeof palette.usd | typeof palette.eur;
}) {
  return (
    <FlexWidget
      style={{
        backgroundColor: palette.surface,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
    >
      <FlexWidget>
        <TextWidget
          text={currency}
          style={{ color: accent, fontSize: 13, fontWeight: 'bold' }}
        />
        <TextWidget
          text={`${formatWidgetAmount(amount)} ${currency}`}
          style={{ color: palette.muted, fontSize: 10, marginTop: 2 }}
        />
      </FlexWidget>
      <TextWidget
        text={formatWidgetRate(amount * rate)}
        style={{ color: palette.text, fontSize: 16, fontWeight: 'bold' }}
      />
    </FlexWidget>
  );
}

export function ILSRateWidget({
  rates,
  error,
}: {
  rates?: WidgetRates;
  error?: boolean;
}): ReactElement {
  const rateClickActionData =
    rates && !error
      ? {
          usdToIls: rates.usdToIls,
          eurToIls: rates.eurToIls,
          updatedAt: rates.updatedAt,
          rateDate: rates.rateDate,
        }
      : undefined;

  return (
    <FlexWidget
      accessibilityLabel="Live US dollar and euro exchange rates to Israeli shekels"
      clickAction="OPEN_APP"
      style={{
        backgroundColor: palette.background,
        borderRadius: 24,
        padding: 16,
        width: 'match_parent',
        height: 'match_parent',
      }}
    >
      <FlexWidget
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <TextWidget
          text="ILS RATES"
          style={{
            color: palette.mint,
            fontSize: 11,
            fontWeight: 'bold',
            letterSpacing: 1,
          }}
        />
        <TextWidget
          text="LIVE"
          style={{
            backgroundColor: palette.surface,
            borderRadius: 8,
            color: palette.mint,
            fontSize: 9,
            fontWeight: 'bold',
            paddingHorizontal: 8,
            paddingVertical: 5,
          }}
        />
      </FlexWidget>

      {error ? (
        <FlexWidget style={{ flex: 1, justifyContent: 'center' }}>
          <TextWidget
            text="Unable to update rates"
            style={{
              color: palette.error,
              fontSize: 15,
              fontWeight: 'bold',
            }}
          />
          <TextWidget
            text="Open the app to try again"
            style={{
              color: palette.muted,
              fontSize: 11,
              marginTop: 5,
            }}
          />
        </FlexWidget>
      ) : rates ? (
        <FlexWidget style={{ flexGap: 8 }}>
          <FlexWidget
            style={{
              backgroundColor: palette.surface,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <TextWidget
              text="AMOUNT · TAP TO EDIT"
              style={{ color: palette.muted, fontSize: 9, fontWeight: 'bold' }}
            />
            <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextWidget
                text="−"
                clickAction="DECREASE_AMOUNT"
                clickActionData={rateClickActionData}
                accessibilityLabel="Decrease amount by one"
                style={{
                  backgroundColor: palette.control,
                  borderRadius: 8,
                  color: palette.text,
                  fontSize: 17,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  width: 30,
                  paddingVertical: 3,
                }}
              />
              <TextWidget
                text={formatWidgetAmount(rates.amount)}
                clickAction="OPEN_APP"
                accessibilityLabel="Tap to edit the amount in the converter"
                style={{
                  color: palette.text,
                  fontSize: 16,
                  fontWeight: 'bold',
                  width: 50,
                  textAlign: 'center',
                  paddingHorizontal: 7,
                  paddingVertical: 3,
                }}
              />
              <TextWidget
                text="+"
                clickAction="INCREASE_AMOUNT"
                clickActionData={rateClickActionData}
                accessibilityLabel="Increase amount by one"
                style={{
                  backgroundColor: palette.control,
                  borderRadius: 8,
                  color: palette.text,
                  fontSize: 17,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  width: 30,
                  paddingVertical: 3,
                }}
              />
            </FlexWidget>
          </FlexWidget>
          <ConversionRow
            amount={rates.amount}
            currency="USD"
            rate={rates.usdToIls}
            accent={palette.usd}
          />
          <ConversionRow
            amount={rates.amount}
            currency="EUR"
            rate={rates.eurToIls}
            accent={palette.eur}
          />
          <FlexWidget
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 1,
            }}
          >
            <TextWidget
              text={`Checked ${formatWidgetTime(rates.updatedAt)}`}
              style={{ color: palette.muted, fontSize: 9 }}
            />
            <TextWidget
              text={`Rates ${formatWidgetDate(rates.rateDate)}`}
              style={{ color: palette.muted, fontSize: 9 }}
            />
          </FlexWidget>
        </FlexWidget>
      ) : (
        <FlexWidget style={{ flex: 1, justifyContent: 'center' }}>
          <TextWidget
            text="Loading live rates…"
            style={{ color: palette.text, fontSize: 15, fontWeight: 'bold' }}
          />
        </FlexWidget>
      )}
    </FlexWidget>
  );
}