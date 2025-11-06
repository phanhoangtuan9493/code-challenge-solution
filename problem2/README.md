# Currency Swap Application

A modern, intuitive currency swap interface built with React, TypeScript, Vite, and Tailwind CSS. This application allows users to swap between different cryptocurrency tokens with real-time exchange rate calculations.

## Features

### Core Functionality
- **Real-time Token Prices**: Fetches live token prices from Switcheo API
- **Token Selection**: Searchable dropdown with token icons and prices
- **Amount Input**: Clean, intuitive input with percentage quick-select buttons (15%, 25%, 50%, 75%, 100%)
- **Exchange Rate Display**: Live calculation showing conversion rates
- **Swap Direction Toggle**: Quick button to reverse swap direction
- **Balance Management**: Mock balance tracking with validation

### User Experience
- **Input Validation**: 
  - Prevents invalid characters (only numbers and decimals)
  - Checks for sufficient balance
  - Validates minimum amounts
  - Prevents same-token swaps
- **Error Handling**: Clear, user-friendly error messages
- **Success Feedback**: Animated success notifications
- **Loading States**: Smooth loading indicators for async operations
- **Responsive Design**: Works beautifully on mobile, tablet, and desktop

### Visual Design
- **Modern Dark Theme**: Sleek dark mode interface with gradient backgrounds
- **Green Accent Color**: Eye-catching green primary color for actions
- **Smooth Animations**: Fade-in effects and transition animations
- **Custom Scrollbar**: Styled scrollbars for dropdowns
- **Token Icons**: Dynamic loading from Switcheo token repository with fallback placeholders
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
│   │   ├── SwapForm.tsx          # Main swap interface component
│   │   └── TokenSelector.tsx     # Token dropdown selector with search
│   ├── services/
│   │   └── tokenService.ts       # API calls and token utilities
│   ├── types.ts                  # TypeScript type definitions
│   ├── App.tsx                   # Root application component
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles and animations
├── package.json
├── vite.config.ts
├── tsconfig.json
└── PROJECT_README.md
```

## Component Architecture

### App.tsx
- Root component managing application state
- Handles token data fetching
- Provides loading and error states
- Passes token data to SwapForm

### SwapForm.tsx
- Main swap interface
- Manages swap state (from/to tokens, amounts)
- Implements input validation logic
- Handles swap transaction simulation
- Displays exchange rates and balances

### TokenSelector.tsx
- Reusable token dropdown component
- Search functionality
- Displays token icons and prices
- Click-outside detection for UX

### tokenService.ts
- Fetches token prices from API
- Provides token icon URLs
- Filters and processes token data
- Calculates exchange rates

## Key Features Implementation

### Percentage Buttons
Quick-select buttons allow users to choose percentage of balance:
```typescript
[15, 25, 50, 75, 100].map(percentage => 
  <button onClick={() => setAmount(balance * percentage / 100)} />
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
- Amount must not exceed balance
- Tokens must be different
- Exchange rate must be valid

### Mock Backend Integration
Simulated API call with loading state:
```typescript
await new Promise(resolve => setTimeout(resolve, 1500));
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

## Styling Approach

### Tailwind CSS Classes
Using Tailwind's utility classes for:
- Layout and spacing
- Colors and backgrounds
- Hover states and transitions
- Responsive design
- Custom animations

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

### Build for Production
```bash
npm run build
# or
yarn build
```

### Preview Production Build
```bash
npm run preview
# or
yarn preview
```

### Linting
```bash
npm run lint
# or
yarn lint
```

## Future Enhancements

Potential improvements for production:
- Real backend integration with blockchain
- Transaction history
- Slippage tolerance settings
- Multi-wallet support
- Price charts and analytics
- Favorites/pinned tokens
- Recent swaps history
- Dark/light theme toggle
- Multiple language support
- Gas fee estimation
- Advanced trading features (limit orders, etc.)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- Lazy loading of token icons
- Debounced search in token selector
- Memoization of exchange rate calculations
- Efficient re-renders with React hooks
- Optimized bundle size with Vite

## Accessibility

- Semantic HTML elements
- Keyboard navigation support
- Focus states on interactive elements
- ARIA labels where appropriate
- Color contrast compliance

## Credits

- Token icons from [Switcheo Token Icons](https://github.com/Switcheo/token-icons)
- Price data from [Switcheo Interview API](https://interview.switcheo.com/prices.json)
- Built with ❤️ using Vite and React

## License

This project is created for demonstration purposes.

