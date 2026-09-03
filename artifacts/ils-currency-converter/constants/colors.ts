/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#102D3A',
    tint: '#167B73',
    background: '#EEF4F3',
    foreground: '#102D3A',
    card: '#FFFFFF',
    cardForeground: '#102D3A',
    primary: '#167B73',
    primaryForeground: '#FFFFFF',
    secondary: '#E0ECE9',
    secondaryForeground: '#18534F',
    muted: '#E4EEEC',
    mutedForeground: '#6A7F82',
    accent: '#D8F1E8',
    accentForeground: '#12665E',
    destructive: '#C94D52',
    destructiveForeground: '#FFFFFF',
    border: '#D5E4E1',
    input: '#CFDFDC',
    usdAccent: '#2B6680',
    eurAccent: '#A9683B',
    success: '#167B73',
    softHighlight: '#F7E8CF',
    shadow: '#1B414A',
  },
  dark: {
    text: '#F1F8F6',
    tint: '#65C8B0',
    background: '#102B33',
    foreground: '#F1F8F6',
    card: '#173B42',
    cardForeground: '#F1F8F6',
    primary: '#65C8B0',
    primaryForeground: '#102B33',
    secondary: '#21484D',
    secondaryForeground: '#CBEDE3',
    muted: '#21484D',
    mutedForeground: '#9AB4B4',
    accent: '#244F4D',
    accentForeground: '#BDEBDF',
    destructive: '#E67C7F',
    destructiveForeground: '#102B33',
    border: '#2A5558',
    input: '#356166',
    usdAccent: '#74B4CB',
    eurAccent: '#E5A474',
    success: '#65C8B0',
    softHighlight: '#514638',
    shadow: '#06171D',
  },
  radius: 20,
};

export default colors;
