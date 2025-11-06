import type { Token } from '../types';
import TokenSelector from './TokenSelectorDialog';
import { useSwapForm } from '../hooks/useSwapForm';

interface SwapFormProps {
  tokens: Token[];
  onSwap: (fromToken: string, toToken: string, fromAmount: number) => Promise<void>;
}

export default function SwapForm({ tokens, onSwap }: SwapFormProps) {
  const {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    balance,
    isLoading,
    error,
    successMessage,
    exchangeRate,
    setFromToken,
    setToToken,
    handleFromAmountChange,
    handlePercentageClick,
    handleSwapTokens,
    handleSubmit,
  } = useSwapForm({ tokens, onSwap });

  return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-700/50 gap-2 flex flex-col p-4 sm:p-5 md:p-6">
        {/* Header */}
        <div className="text-gray-400 text-base sm:text-lg">
          Balance: <span className="text-white font-semibold">{balance.toLocaleString()}</span>
        </div>

        <form onSubmit={handleSubmit} className="gap-4 sm:gap-5 flex flex-col">
          {/* From Section */}
          <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-xs sm:text-sm font-medium">You pay</span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 mb-3">
              <input
                type="text"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent text-white text-2xl sm:text-3xl md:text-4xl font-bold outline-none placeholder-gray-600 min-w-0"
              />
              {fromToken && (
                <TokenSelector
                  tokens={tokens}
                  selectedToken={fromToken}
                  onSelectToken={setFromToken}
                />
              )}
            </div>

            {/* Percentage Buttons */}
            <div className="flex gap-1.5 sm:gap-2">
              {[15, 25, 50, 75, 100].map((percentage) => (
                <button
                  key={percentage}
                  type="button"
                  onClick={() => handlePercentageClick(percentage)}
                  className="flex-1 px-1.5 sm:px-2 py-1 sm:py-1.5 bg-gray-900/50 hover:bg-gray-700/50 text-gray-300 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium transition-colors border border-gray-700/30"
                >
                  {percentage}%
                </button>
              ))}
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-1 sm:-my-2">
            <button
              type="button"
              onClick={handleSwapTokens}
              className="bg-green-500 hover:bg-green-400 p-2 sm:p-2.5 rounded-full transition-all duration-200 transform hover:scale-110 shadow-lg active:scale-95"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* To Section */}
          <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700/50 mb-2 sm:mb-3">
            <div className="flex justify-between items-center mb-2 flex-wrap gap-1">
              <span className="text-gray-400 text-xs sm:text-sm font-medium">You receive</span>
              {toAmount && parseFloat(toAmount) > 0 && (
                <span className="text-gray-400 text-[10px] sm:text-xs">
                  Min. received: <span className="text-white font-semibold">{(parseFloat(toAmount) * 0.995).toFixed(6)}</span>
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="text"
                value={toAmount}
                readOnly
                placeholder="0.00"
                className="flex-1 bg-transparent text-white text-2xl sm:text-3xl md:text-4xl font-bold outline-none placeholder-gray-600 min-w-0"
              />
              {toToken && (
                <TokenSelector
                  tokens={tokens}
                  selectedToken={toToken}
                  onSelectToken={setToToken}
                />
              )}
            </div>
          </div>

          {/* Exchange Rate */}
          {fromToken && toToken && exchangeRate > 0 && (
            <div className="text-center text-gray-400 text-sm sm:text-base md:text-lg">
              1 {fromToken} = {exchangeRate.toFixed(8)} {toToken}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-2 sm:mb-3 p-2 sm:p-2.5 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-xs sm:text-sm flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="flex-1">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-2 sm:mb-3 p-2 sm:p-2.5 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-xs sm:text-sm flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="flex-1">{successMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !fromAmount || parseFloat(fromAmount) <= 0}
            className={`
              w-full py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg transition-all duration-200
              ${isLoading || !fromAmount || parseFloat(fromAmount) <= 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-400 text-black shadow-lg hover:shadow-green-500/50 active:scale-[0.98]'
              }
            `}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Transfer'
            )}
          </button>
        </form>
      </div>
  );
}

