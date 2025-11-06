import type { Token } from '../types';

const PRICES_URL = 'https://interview.switcheo.com/prices.json';
const TOKEN_ICONS_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

export const fetchTokenPrices = async (): Promise<Token[]> => {
  try {
    const response = await fetch(PRICES_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch token prices');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching token prices:', error);
    throw error;
  }
};

export const getTokenIconUrl = (currency: string): string => {
  return `${TOKEN_ICONS_BASE_URL}/${currency}.svg`;
};

export const getUniqueTokens = (tokens: Token[]): Token[] => {
  const tokenMap = new Map<string, Token>();
  
  tokens.forEach(token => {
    if (token.price && token.price > 0) {
      const existing = tokenMap.get(token.currency);
      if (!existing || new Date(token.date) > new Date(existing.date)) {
        tokenMap.set(token.currency, token);
      }
    }
  });
  
  return Array.from(tokenMap.values()).sort((a, b) => 
    a.currency.localeCompare(b.currency)
  );
};

export const calculateExchangeRate = (
  fromToken: Token | undefined,
  toToken: Token | undefined
): number => {
  if (!fromToken || !toToken || fromToken.price === 0) {
    return 0;
  }
  return fromToken.price / toToken.price;
};

