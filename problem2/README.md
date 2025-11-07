# Currency Swap Application

A modern, intuitive currency swap interface built with React, TypeScript, Vite, and Tailwind CSS. This application allows users to swap between different cryptocurrency tokens with real-time exchange rate calculations.

## Features

### Core Functionality
- **Real-time Token Prices**: Fetches live token prices from Switcheo API
- **Random Token Balances**: Each token is assigned a random balance (0-1000) on load
- **Token Selection Dialog**: Modal-based token selector with search functionality
- **Smart Token Filtering**: "From" selector only shows tokens with balance > 0, "To" selector shows all tokens
- **Amount Input**: Clean, intuitive input with percentage quick-select buttons (15%, 25%, 50%, 75%, 100%)
- **Exchange Rate Display**: Live calculation showing conversion rates
- **Swap Direction Toggle**: Quick button to reverse swap direction
- **Individual Token Balance Tracking**: Each token has its own balance that updates after swaps
- **Dynamic Balance Updates**: Balances adjust in real-time - subtracts from source, adds to destination

### User Experience
- **Input Validation**: 
  - Prevents invalid characters (only numbers and decimals)
  - Checks for sufficient balance
  - Validates minimum amounts
  - Prevents same-token swaps
- **Error Handling**: Clear, user-friendly error messages
- **Success Feedback**: Animated success notifications
- **Loading States**: Smooth loading indicators for async operations
- **Fully Responsive Design**: 
  - Mobile-first approach with Tailwind breakpoints
  - Touch-friendly tap targets (minimum 44x44px)
  - Adaptive text sizes and spacing
  - Works beautifully on mobile, tablet, and desktop

### Visual Design
- **Modern Dark Theme**: Sleek dark mode interface with gradient backgrounds
- **Green Accent Color**: Eye-catching green primary color for actions
- **Smooth Animations**: Fade-in effects, scale animations, and transitions
- **Custom Scrollbar**: Styled scrollbars for dialog lists
- **Token Icons**: Dynamic loading from Switcheo token repository with fallback gradient placeholders
- **Modal Dialog**: Centered dialog with backdrop blur and ESC key support
- **Glass-morphism Effects**: Semi-transparent backgrounds with blur effects

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety and better developer experience
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **ESLint** - Code quality and consistency

## Project Structure

```
problem2/
├── src/
│   ├── components/
│   │   ├── SwapForm.tsx             # Main swap interface (presentation)
│   │   ├── TokenSelectorDialog.tsx  # Modal token selector (presentation)
│   │   └── TokenIcon.tsx            # Token icon with fallback
│   ├── hooks/
│   │   ├── index.ts                 # Barrel exports for hooks
│   │   ├── useSwapForm.ts           # Swap form logic and state
│   │   └── useTokenSelector.ts      # Token selector logic and state
│   ├── services/
│   │   └── tokenService.ts          # API calls and token utilities
│   ├── types.ts                     # TypeScript type definitions
│   ├── App.tsx                      # Root application component
│   ├── main.tsx                     # Application entry point
│   └── index.css                    # Global styles and animations
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Architecture

### Component Layer (Presentation)

#### App.tsx
- Simplified root component (~25 lines)
- Minimal layout wrapper with header
- No state management (moved to hook)
- Responsive layout with mobile-first design
- Self-contained SwapForm component

#### SwapForm.tsx (Presentation Component)
- Pure presentation component (~170 lines)
- Renders swap interface UI including loading/error states
- Delegates all logic to `useSwapForm` hook
- Responsive design with adaptive text sizes
- Displays both "from" and "to" token balances in header
- Shows individual token balances with currency symbols

#### TokenSelectorDialog.tsx (Presentation Component)
- Pure presentation component (~135 lines)
- Modal dialog for token selection
- Delegates all logic to `useTokenSelector` hook
- Responsive dialog with mobile optimization
- Search input and scrollable token list
- Supports optional balance filtering via `filterByBalance` prop

#### TokenIcon.tsx
- Displays token icons with image fallback
- Responsive sizes (mobile/desktop)
- Gradient background placeholder with currency initial

### Logic Layer (Custom Hooks)

#### useSwapForm Hook
**Manages all swap form business logic:**
- **Token Fetching**: Loads token prices from API on mount
- **State Management**: tokens, amounts, individual balances, loading states, errors
- **Balance Initialization**: Assigns random balance to each token (0-1000)
- **Token Initialization**: Defaults to WBTC → ETH
- **Exchange Rate Calculation**: Auto-updates with real-time calculations
- **Input Validation**: Validates against individual token balances
- **Percentage Selection**: Calculates amount based on selected token's balance
- **Token Swapping**: Swaps from/to tokens and clears amounts
- **Swap Execution**: Handles simulated API call with 1.5s delay
- **Balance Updates**: Updates both token balances after successful swap
- **Error Handling**: Loading, fetch errors, and swap errors
- **Success Messages**: Auto-dismissing notifications (3s)

**Returns:**
```typescript
{
  // State
  tokens, isLoadingTokens, fetchError,
  fromToken, toToken, fromAmount, toAmount,
  fromTokenBalance, toTokenBalance,
  isLoading, error, successMessage, exchangeRate,
  fromTokenData, toTokenData,
  // Actions
  setFromToken, setToToken, handleFromAmountChange,
  handlePercentageClick, handleSwapTokens, handleSubmit
}
```

#### useTokenSelector Hook
**Manages token selector dialog logic:**
- Dialog open/close state management
- Search functionality with real-time filtering
- **Optional Balance Filtering**: Filters tokens by balance > 0 when enabled
- Body scroll lock when dialog is open
- Keyboard support (ESC to close)
- Token selection handling
- Search term management

**Returns:**
```typescript
{
  // State
  isOpen, searchTerm, selectedTokenData, filteredTokens,
  // Actions
  setSearchTerm, handleSelectToken, handleClose, handleOpen
}
```

### Service Layer

#### tokenService.ts
- **`fetchTokenPrices()`**: Fetches token prices from Switcheo API
- **`getTokenIconUrl()`**: Provides token icon URLs from GitHub
- **`getUniqueTokens()`**: Filters and processes token data
  - Removes duplicates, keeps latest prices
  - Assigns random balance (0-1000) to each token
  - Sorts tokens alphabetically by currency
- **`calculateExchangeRate()`**: Calculates exchange rates between two tokens

## Key Features Implementation

### Percentage Buttons
Quick-select buttons allow users to choose percentage of the selected token's balance:
```typescript
const fromTokenBalance = tokens.find(t => t.currency === fromToken)?.balance || 0;
const amount = (fromTokenBalance * percentage / 100).toFixed(2);
[15, 25, 50, 75, 100].map(percentage => 
  <button onClick={() => handlePercentageClick(percentage)} />
)
```

### Exchange Rate Calculation
Real-time calculation based on token prices:
```typescript
const exchangeRate = fromTokenPrice / toTokenPrice;
const toAmount = fromAmount * exchangeRate;
```

### Input Validation
Comprehensive validation before swap:
- Amount must be positive
- Amount must not exceed the specific token's balance
- Tokens must be different
- Exchange rate must be valid

### Token Balance Management
Individual balance tracking for each token:
```typescript
// After successful swap
setTokens(prevTokens => 
  prevTokens.map(token => {
    if (token.currency === fromToken) {
      return { ...token, balance: token.balance - fromAmount };
    }
    if (token.currency === toToken) {
      return { ...token, balance: token.balance + toAmount };
    }
    return token;
  })
);
```

### Smart Token Filtering
Different filtering logic for "from" and "to" selectors:
```typescript
// "From" selector: only tokens with balance > 0
<TokenSelector 
  tokens={tokens} 
  selectedToken={fromToken}
  onSelectToken={setFromToken}
  filterByBalance={true}  // Only show tokens with balance
/>

// "To" selector: all tokens available
<TokenSelector 
  tokens={tokens} 
  selectedToken={toToken}
  onSelectToken={setToToken}
  // filterByBalance defaults to false
/>
```

### Mock Backend Integration
Simulated swap API call with loading state:
```typescript
const handleSwap = async (fromToken: string, toToken: string, fromAmount: number, toAmount: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log(`Swapping ${fromAmount} ${fromToken} to ${toAmount} ${toToken}`);
      resolve();
    }, 1500);
  });
};
```

## API Integration

### Token Prices
- **Endpoint**: `https://interview.switcheo.com/prices.json`
- **Data**: Array of token objects with currency, date, and price
- **Processing**: Filters tokens with valid prices, keeps most recent data

### Token Icons
- **Repository**: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/`
- **Format**: SVG images
- **Fallback**: Placeholder images for missing tokens

## Design Patterns

### Separation of Concerns
- **Components**: Pure presentation, no business logic
- **Hooks**: All business logic, state management, side effects, data fetching
- **Services**: API calls, data transformation, utilities

### Single Source of Truth
- Token balances are stored directly in the `Token` type
- No separate state for balances - maintains consistency
- All balance operations work directly with the tokens array

### Benefits of This Architecture
1. **Testability**: Hooks can be unit tested independently
2. **Reusability**: Hooks can be used across multiple components
3. **Maintainability**: Logic changes don't require UI changes
4. **Readability**: Components are clean and easy to understand
5. **Code Organization**: Clear separation between logic and presentation
6. **Consistency**: Single source of truth prevents state synchronization issues
7. **Encapsulation**: All swap logic (including data fetching) contained in one hook

## Styling Approach

### Tailwind CSS Classes
Using Tailwind's utility classes for:
- **Responsive Design**: `sm:`, `md:` breakpoints for mobile-first design
- Layout and spacing with adaptive values
- Colors and backgrounds with opacity variants
- Hover and active states for interactions
- Custom animations and transitions

### Responsive Breakpoints
- **Mobile**: Default (< 640px)
- **Tablet**: `sm:` (≥ 640px)
- **Desktop**: `md:` (≥ 768px)

### Custom CSS
Additional styles in `index.css`:
- Custom scrollbar styling
- Loading shimmer animation
- Fade-in animation
- Global resets

## Running the Application

### Development
```bash
npm run dev
# or
yarn dev
```

## Credits

- Token icons from [Switcheo Token Icons](https://github.com/Switcheo/token-icons)
- Price data from [Switcheo Interview API](https://interview.switcheo.com/prices.json)
- Built with ❤️ using React 19, TypeScript, Vite, and Tailwind CSS 4

