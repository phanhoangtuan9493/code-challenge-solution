import { useState, useEffect } from 'react';
import type { Token } from '../types';
import { calculateExchangeRate } from '../services/tokenService';

interface UseSwapFormProps {
  tokens: Token[];
  onSwap: (fromToken: string, toToken: string, fromAmount: number) => Promise<void>;
}

export function useSwapForm({ tokens, onSwap }: UseSwapFormProps) {
  const [fromToken, setFromToken] = useState<string>('');
  const [toToken, setToToken] = useState<string>('');
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [balance, setBalance] = useState<number>(1000);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    const amount = (balance * percentage / 100).toFixed(2);
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

    if (parseFloat(fromAmount) > balance) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSwap()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Simulate API call with delay
      await onSwap(fromToken, toToken, parseFloat(fromAmount));
      
      // Update balance (mock)
      setBalance(prev => prev - parseFloat(fromAmount));
      
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

  return {
    // State
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    balance,
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

