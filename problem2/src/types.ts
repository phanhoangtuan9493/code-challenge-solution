export interface Token {
  currency: string;
  date: string;
  price: number;
}

export interface TokenBalance {
  currency: string;
  balance: number;
  price: number;
}

export interface SwapState {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  isLoading: boolean;
  error: string | null;
}

