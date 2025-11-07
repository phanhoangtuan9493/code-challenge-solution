import { useState, useEffect } from 'react';
import type { Token } from '../types';
import { calculateExchangeRate, fetchTokenPrices, getUniqueTokens } from '../services/tokenService';

export function useSwapForm() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fromToken, setFromToken] = useState<string>('');
  const [toToken, setToToken] = useState<string>('');
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch tokens on mount
  useEffect(() => {
    const loadTokens = async () => {
      try {
        setIsLoadingTokens(true);
        const data = await fetchTokenPrices();
        const uniqueTokens = getUniqueTokens(data);
        setTokens(uniqueTokens);
        setFetchError(null);
      } catch (err) {
        setFetchError('Failed to load token prices. Please refresh the page.');
        console.error('Error loading tokens:', err);
      } finally {
        setIsLoadingTokens(false);
      }
    };

    loadTokens();
  }, []);

  // Initialize default tokens
  useEffect(() => {
    if (tokens.length > 0 && !fromToken) {
      const wbtcToken = tokens.find(t => t.currency === 'WBTC');
      const ethToken = tokens.find(t => t.currency === 'ETH');
      
      setFromToken(wbtcToken?.currency || tokens[0].currency);
      setToToken(ethToken?.currency || tokens[1]?.currency || tokens[0].currency);
    }
  }, [tokens, fromToken]);

  // Calculate exchange rate and update toAmount when inputs change
  useEffect(() => {
    if (fromAmount && fromToken && toToken) {
      const fromTokenData = tokens.find(t => t.currency === fromToken);
      const toTokenData = tokens.find(t => t.currency === toToken);
      const rate = calculateExchangeRate(fromTokenData, toTokenData);
      
      const calculatedAmount = parseFloat(fromAmount) * rate;
      setToAmount(calculatedAmount > 0 ? calculatedAmount.toFixed(8) : '0');
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromToken, toToken, tokens]);

  const handleFromAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value);
      setError(null);
    }
  };

  const handlePercentageClick = (percentage: number) => {
    const fromTokenData = tokens.find(t => t.currency === fromToken);
    const fromTokenBalance = fromTokenData?.balance || 0;
    const amount = (fromTokenBalance * percentage / 100).toFixed(2);
    setFromAmount(amount);
    setError(null);
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount('');
    setToAmount('');
    setError(null);
  };

  const validateSwap = (): boolean => {
    setError(null);

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    const fromTokenData = tokens.find(t => t.currency === fromToken);
    const fromTokenBalance = fromTokenData?.balance || 0;
    if (parseFloat(fromAmount) > fromTokenBalance) {
      setError('Insufficient balance');
      return false;
    }

    if (fromToken === toToken) {
      setError('Cannot swap the same token');
      return false;
    }

    const toAmountNum = parseFloat(toAmount);
    if (!toAmountNum || toAmountNum <= 0) {
      setError('Invalid exchange rate');
      return false;
    }

    return true;
  };

  const handleSwap = async (fromToken: string, toToken: string, fromAmount: number, toAmount: number) => {
    // Simulate API call with delay
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log(`Swapping ${fromAmount} ${fromToken} to ${toAmount} ${toToken}`);
        resolve();
      }, 1500);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSwap()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const fromAmountNum = parseFloat(fromAmount);
      const toAmountNum = parseFloat(toAmount);
      
      // Simulate API call with delay
      await handleSwap(fromToken, toToken, fromAmountNum, toAmountNum);
      
      // Update the tokens array with new balances directly
      setTokens(prevTokens => 
        prevTokens.map(token => {
          if (token.currency === fromToken) {
            return { ...token, balance: token.balance - fromAmountNum };
          }
          if (token.currency === toToken) {
            return { ...token, balance: token.balance + toAmountNum };
          }
          return token;
        })
      );
      
      setSuccessMessage(`Successfully swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`);
      setFromAmount('');
      setToAmount('');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Swap failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fromTokenData = tokens.find(t => t.currency === fromToken);
  const toTokenData = tokens.find(t => t.currency === toToken);
  const exchangeRate = calculateExchangeRate(fromTokenData, toTokenData);
  const fromTokenBalance = fromTokenData?.balance || 0;
  const toTokenBalance = toTokenData?.balance || 0;

  return {
    // State
    tokens,
    isLoadingTokens,
    fetchError,
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    fromTokenBalance,
    toTokenBalance,
    isLoading,
    error,
    successMessage,
    exchangeRate,
    fromTokenData,
    toTokenData,
    // Actions
    setFromToken,
    setToToken,
    handleFromAmountChange,
    handlePercentageClick,
    handleSwapTokens,
    handleSubmit,
  };
}

