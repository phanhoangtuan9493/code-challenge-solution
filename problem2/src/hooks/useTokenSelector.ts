import { useState, useEffect } from 'react';
import type { Token } from '../types';

interface UseTokenSelectorProps {
  tokens: Token[];
  selectedToken: string;
  onSelectToken: (currency: string) => void;
}

export function useTokenSelector({ tokens, selectedToken, onSelectToken }: UseTokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedTokenData = tokens.find(t => t.currency === selectedToken);

  const filteredTokens = tokens.filter(token =>
    token.currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleSelectToken = (currency: string) => {
    onSelectToken(currency);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return {
    // State
    isOpen,
    searchTerm,
    selectedTokenData,
    filteredTokens,
    // Actions
    setSearchTerm,
    handleSelectToken,
    handleClose,
    handleOpen,
  };
}

