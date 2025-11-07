import type { Token } from '../types';
import TokenIcon from './TokenIcon';
import { useTokenSelector } from '../hooks/useTokenSelector';

interface TokenSelectorProps {
  tokens: Token[];
  selectedToken: string;
  onSelectToken: (currency: string) => void;
  disabled?: boolean;
  filterByBalance?: boolean;
}

export default function TokenSelector({
  tokens,
  selectedToken,
  onSelectToken,
  disabled = false,
  filterByBalance = false
}: TokenSelectorProps) {
  const {
    isOpen,
    searchTerm,
    selectedTokenData,
    filteredTokens,
    setSearchTerm,
    handleSelectToken,
    handleClose,
    handleOpen,
  } = useTokenSelector({ tokens, selectedToken, onSelectToken, filterByBalance });

  return (
    <>
      <button
        type="button"
        onClick={() => !disabled && handleOpen()}
        disabled={disabled}
        className={`
          flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl min-w-[100px] sm:min-w-[120px]
          bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200
          border border-gray-700/50
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {selectedTokenData && (
          <>
            <TokenIcon currency={selectedTokenData.currency} />
            <span className="text-white font-semibold text-sm sm:text-base flex-1 text-left">
              {selectedTokenData.currency}
            </span>
          </>
        )}
        <svg
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 transition-transform duration-200 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
            onClick={handleClose}
          />
          
          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <div 
              className="bg-gray-800 border border-gray-700 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-[90vw] sm:max-w-md max-h-[85vh] sm:max-h-[80vh] flex flex-col animate-in fade-in zoom-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-700">
                <h2 className="text-lg sm:text-xl font-bold text-white">Select Token</h2>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700/50 active:scale-95"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Search */}
              <div className="p-3 sm:p-4 border-b border-gray-700">
                <input
                  type="text"
                  placeholder="Search token..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  autoFocus
                />
              </div>
              
              {/* Token List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredTokens.length > 0 ? (
                  filteredTokens.map((token) => (
                    <button
                      key={token.currency}
                      onClick={() => handleSelectToken(token.currency)}
                      className={`
                        w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-700/50 transition-colors active:bg-gray-700
                        ${token.currency === selectedToken ? 'bg-gray-700/30' : ''}
                      `}
                    >
                      <TokenIcon currency={token.currency} />
                      <div className="flex-1 text-left min-w-0">
                        <div className="text-white font-semibold text-sm sm:text-base">{token.currency}</div>
                        <div className="text-gray-400 text-xs sm:text-sm truncate">${token.price.toFixed(6)}</div>
                      </div>
                      {token.currency === selectedToken && (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-3 sm:px-4 py-6 sm:py-8 text-center text-gray-400 text-sm sm:text-base">
                    No tokens found
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

