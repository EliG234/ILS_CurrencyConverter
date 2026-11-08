import { HStack, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import {
  containerBackground,
  font,
  foregroundStyle,
  padding,
  widgetURL,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

import {
  formatWidgetRate,
  formatWidgetTime,
  type WidgetRates,
} from '../rates';

const ILSRateWidgetView = (
  props: WidgetRates,
  environment: WidgetEnvironment,
) => {
  'widget';

  const isSmall = environment.widgetFamily === 'systemSmall';

  return (
    <VStack
      spacing={isSmall ? 9 : 12}
      modifiers={[
        padding({ all: 16 }),
        containerBackground('#102A43', 'widget'),
        widgetURL('ils-currency-converter://'),
      ]}
    >
      <HStack alignment="center">
        <Text
          modifiers={[
            font({ size: 12, weight: 'bold' }),
            foregroundStyle('#8FE3CF'),
          ]}
        >
          ILS RATES
        </Text>
        <Spacer />
        <Text
          modifiers={[
            font({ size: 10, weight: 'bold' }),
            foregroundStyle('#8FE3CF'),
          ]}
        >
          LIVE
        </Text>
      </HStack>

      <VStack alignment="leading" spacing={isSmall ? 7 : 10}>
        <HStack alignment="lastTextBaseline" spacing={8}>
          <Text modifiers={[font({ size: 13, weight: 'bold' }), foregroundStyle('#72B7FF')]}>
            USD
          </Text>
          <Spacer />
          <Text modifiers={[font({ size: isSmall ? 16 : 18, weight: 'bold' }), foregroundStyle('white')]}>
            {formatWidgetRate(props.usdToIls)}
          </Text>
        </HStack>
        <HStack alignment="lastTextBaseline" spacing={8}>
          <Text modifiers={[font({ size: 13, weight: 'bold' }), foregroundStyle('#FFC66D')]}>
            EUR
          </Text>
          <Spacer />
          <Text modifiers={[font({ size: isSmall ? 16 : 18, weight: 'bold' }), foregroundStyle('white')]}>
            {formatWidgetRate(props.eurToIls)}
          </Text>
        </HStack>
      </VStack>

      {!isSmall ? (
        <Text
          modifiers={[
            font({ size: 10, weight: 'regular' }),
            foregroundStyle('#A9C1D3'),
          ]}
        >
          Updated {formatWidgetTime(props.updatedAt)} · Tap to convert
        </Text>
      ) : null}
    </VStack>
  );
};

export const ILSRateWidget = createWidget('ILSRateWidget', ILSRateWidgetView);