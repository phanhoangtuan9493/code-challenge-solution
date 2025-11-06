import { useState, useEffect } from 'react';
import SwapForm from './components/SwapForm';
import type { Token } from './types';
import { fetchTokenPrices, getUniqueTokens } from './services/tokenService';

function App() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTokens = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTokenPrices();
        const uniqueTokens = getUniqueTokens(data);
        setTokens(uniqueTokens);
        setError(null);
      } catch (err) {
        setError('Failed to load token prices. Please refresh the page.');
        console.error('Error loading tokens:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTokens();
  }, []);

  const handleSwap = async (fromToken: string, toToken: string, fromAmount: number) => {
    // Simulate API call with delay
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log(`Swapping ${fromAmount} ${fromToken} to ${toToken}`);
        resolve();
      }, 1500);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-900 to-gray-800">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8 fade-in gap-2 flex flex-col w-full max-w-md">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Currency <span className="text-green-500">Swap</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base">
            Trade tokens instantly with the best rates
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 gap-4 w-full max-w-md">
            <div className="relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-700 border-t-green-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-400 mt-2 sm:mt-4 text-sm sm:text-base">Loading tokens...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center gap-3 sm:gap-4 flex flex-col w-full max-w-md">
            <p className="text-red-400 text-base sm:text-lg">Something went wrong. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-red-500 hover:bg-red-400 text-white rounded-lg transition-colors text-sm sm:text-base h-10 sm:h-11"
            >
              Retry
            </button>
          </div>
        )}

        {/* Swap Form */}
        {!isLoading && !error && tokens.length > 0 && (
          <div className="fade-in w-full max-w-3xl">
            <SwapForm tokens={tokens} onSwap={handleSwap} />
          </div>
        )}

        {/* Footer Info */}
        {!isLoading && !error && tokens.length > 0 && (
          <div className="mt-4 sm:mt-6 md:mt-8 text-center text-gray-500 text-xs sm:text-sm fade-in gap-1 sm:gap-2 flex flex-col w-full max-w-md px-4">
            <p>
              {tokens.length} tokens available • Powered by Switcheo
            </p>
            <p className="mt-0.5 sm:mt-1">
              Exchange rates update in real-time
            </p>
          </div>
        )}
    </div>
  );
}

export default App;
