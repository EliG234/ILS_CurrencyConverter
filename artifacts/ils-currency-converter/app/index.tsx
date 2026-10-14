import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  getGetRatesQueryKey,
  useGetRates,
} from '@workspace/api-client-react';
import { useColors } from '@/hooks/useColors';

function formatAmount(value: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function RateCard({
  colors,
  currency,
  symbol,
  rate,
  total,
  accent,
}: {
  colors: ReturnType<typeof useColors>;
  currency: 'USD' | 'EUR';
  symbol: '$' | '€';
  rate: number | undefined;
  total: number | undefined;
  accent: string;
}) {
  const isLoading = rate === undefined || total === undefined;

  return (
    <View
      style={[
        styles.rateCard,
        { backgroundColor: colors.card },
      ]}
    >
      <View style={[styles.cardAccent, { backgroundColor: accent }]} />
      <View style={styles.cardTopRow}>
        <View style={styles.currencyIdentity}>
          <View style={[styles.currencyIcon, { backgroundColor: `${accent}18` }]}>
            <Text style={[styles.currencySymbol, { color: accent }]}>
              {symbol}
            </Text>
          </View>
          <View>
            <Text style={[styles.currencyCode, { color: colors.foreground }]}>
              {currency}
            </Text>
            <Text style={[styles.currencyPair, { color: colors.mutedForeground }]}>
              {currency} to ILS
            </Text>
          </View>
        </View>
        <Ionicons name="arrow-up-outline" size={20} color={accent} />
      </View>

      <View style={styles.rateLine}>
        <Text style={[styles.ratePrefix, { color: colors.mutedForeground }]}>
          1 {currency} =
        </Text>
        {isLoading ? (
          <View style={styles.loadingRate}>
            <ActivityIndicator size="small" color={accent} />
          </View>
        ) : (
          <Text style={[styles.rateValue, { color: colors.foreground }]}>
            ₪{rate.toFixed(2)}
          </Text>
        )}
      </View>

      <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />

      <Text style={[styles.totalCaption, { color: colors.mutedForeground }]}>
        Converted total
      </Text>
      {isLoading ? (
        <View style={[styles.totalSkeleton, { backgroundColor: colors.muted }]} />
      ) : (
        <Text style={[styles.totalValue, { color: colors.foreground }]}>
          ₪{formatAmount(total)}
        </Text>
      )}
    </View>
  );
}

export default function CurrencyConverterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [amountText, setAmountText] = useState<string>('1');
  const {
    data: rates,
    dataUpdatedAt,
    error,
    isFetching: isRefreshing,
    refetch,
  } = useGetRates({
    query: {
      queryKey: getGetRatesQueryKey(),
      refetchOnMount: 'always',
      staleTime: 0,
    },
  });

  const amount = useMemo(() => {
    const parsed = Number.parseFloat(amountText);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  }, [amountText]);

  const topPadding = insets.top + (Platform.OS === 'web' ? 67 : 24);
  const bottomPadding = insets.bottom + (Platform.OS === 'web' ? 34 : 24);
  const errorMessage = error
    ? 'We could not update the rates. Check your connection and try again.'
    : null;
  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt) : null;

  useEffect(() => {
    if (!rates) return;

    const widgetRates = {
      usdToIls: rates.usdToIls,
      eurToIls: rates.eurToIls,
      updatedAt: rates.date,
    };

    if (Platform.OS === 'android') {
      void import('../widgets/android/update')
        .then(({ updateAndroidRateWidget }) => updateAndroidRateWidget(widgetRates))
        .catch(() => undefined);
    } else if (Platform.OS === 'ios') {
      void import('../widgets/ios/update')
        .then(({ updateIosRateWidget }) => updateIosRateWidget(widgetRates))
        .catch(() => undefined);
    }
  }, [rates]);

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPadding, paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <Pressable onPress={Keyboard.dismiss} style={styles.pressableContent}>
          <View style={styles.header}>
            <View style={styles.eyebrowRow}>
              <View style={[styles.liveDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.eyebrow, { color: colors.success }]}>
                LIVE MARKET RATES
              </Text>
            </View>
            <Text style={[styles.title, { color: colors.foreground }]}>
              ILS converter
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              See what your money is worth in shekels.
            </Text>
          </View>

          <View style={[styles.amountPanel, { backgroundColor: colors.primary }]}>
            <Text
              style={[
                styles.amountLabel,
                { color: `${colors.primaryForeground}B8` },
              ]}
            >
              AMOUNT TO CONVERT
            </Text>
            <View style={styles.amountInputRow}>
              <TextInput
                testID="amount-input"
                value={amountText}
                onChangeText={(value) => {
                  const normalized = value.replace(',', '.').replace(/[^0-9.]/g, '');
                  const firstDot = normalized.indexOf('.');
                  const cleaned =
                    firstDot === -1
                      ? normalized
                      : `${normalized.slice(0, firstDot + 1)}${normalized
                          .slice(firstDot + 1)
                          .replace(/\./g, '')}`;
                  setAmountText(cleaned);
                }}
                keyboardType="decimal-pad"
                inputMode="decimal"
                returnKeyType="done"
                selectTextOnFocus
                placeholder="1"
                placeholderTextColor={`${colors.primaryForeground}99`}
                style={[styles.amountInput, { color: colors.primaryForeground }]}
                accessibilityLabel="Amount to convert"
              />
            </View>
          </View>

          <View style={styles.sectionHeading}>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Your conversion
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.mutedForeground }]}>
                Latest USD and EUR rates
              </Text>
            </View>
          </View>

          <View style={styles.cards}>
            <RateCard
              colors={colors}
              currency="USD"
              symbol="$"
              rate={rates?.usdToIls}
              total={rates ? amount * rates.usdToIls : undefined}
              accent={colors.usdAccent}
            />
            <RateCard
              colors={colors}
              currency="EUR"
              symbol="€"
              rate={rates?.eurToIls}
              total={rates ? amount * rates.eurToIls : undefined}
              accent={colors.eurAccent}
            />
          </View>

          {errorMessage ? (
            <View style={[styles.errorBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="alert-circle-outline" size={20} color={colors.destructive} />
              <Text style={[styles.errorText, { color: colors.foreground }]}>
                {errorMessage}
              </Text>
            </View>
          ) : null}

          <Pressable
            testID="refresh-rates-button"
            accessibilityRole="button"
            accessibilityLabel="Refresh exchange rates"
            onPress={() => void refetch()}
            disabled={isRefreshing}
            style={({ pressed }) => [
              styles.refreshButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed || isRefreshing ? 0.72 : 1,
              },
            ]}
          >
            {isRefreshing ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons name="refresh-outline" size={20} color={colors.primary} />
            )}
            <Text style={[styles.refreshText, { color: colors.primary }]}>
              {isRefreshing ? 'Updating rates…' : 'Refresh rates'}
            </Text>
          </Pressable>

          <View style={styles.footer}>
            <Ionicons name="time-outline" size={15} color={colors.mutedForeground} />
            <Text style={[styles.updatedText, { color: colors.mutedForeground }]}>
              {lastUpdated
                ? `Last updated ${lastUpdated.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`
                : 'Fetching the latest rates…'}
            </Text>
            <View style={[styles.footerDot, { backgroundColor: colors.border }]} />
            <Text style={[styles.updatedText, { color: colors.mutedForeground }]}>
              Frankfurter API
            </Text>
          </View>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  pressableContent: {
    flexGrow: 1,
  },
  header: {
    marginBottom: 18,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  eyebrow: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 1.3,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 29,
    letterSpacing: -1.1,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginTop: 3,
  },
  amountPanel: {
    borderRadius: 22,
    padding: 16,
    marginBottom: 18,
  },
  amountLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 1.2,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  amountInput: {
    flex: 1,
    fontFamily: 'Inter_700Bold',
    fontSize: 40,
    letterSpacing: -1.5,
    minWidth: 80,
    padding: 0,
    textAlign: 'center',
  },
  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 2,
  },
  cards: {
    gap: 10,
  },
  rateCard: {
    borderRadius: 19,
    padding: 14,
    overflow: 'hidden',
    elevation: 2,
  },
  cardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currencyIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  currencyIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencySymbol: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
  },
  currencyCode: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  currencyPair: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    marginTop: 1,
  },
  rateLine: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 9,
    gap: 5,
  },
  ratePrefix: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  rateValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 19,
    letterSpacing: -0.3,
  },
  loadingRate: {
    height: 22,
    justifyContent: 'center',
  },
  cardDivider: {
    height: 1,
    marginVertical: 8,
  },
  totalCaption: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  totalValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 29,
    letterSpacing: -0.8,
    marginTop: 1,
  },
  totalSkeleton: {
    borderRadius: 6,
    height: 33,
    marginTop: 1,
    width: 132,
  },
  errorBox: {
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    marginTop: 12,
    padding: 10,
  },
  errorText: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    lineHeight: 18,
  },
  refreshButton: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 46,
  },
  refreshText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    marginTop: 10,
  },
  updatedText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
  },
  footerDot: {
    borderRadius: 2,
    height: 3,
    marginHorizontal: 2,
    width: 3,
  },
});