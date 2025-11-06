import { useState } from 'react';
import { getTokenIconUrl } from '../services/tokenService';

interface TokenIconProps {
  currency: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function TokenIcon({ currency }: TokenIconProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`w-10 h-10 sm:w-12 sm:h-12 text-sm sm:text-base rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 overflow-hidden`}>
      {!imageError ? (
        <img
          src={getTokenIconUrl(currency)}
          alt={currency}
          className={`w-10 h-10 sm:w-12 sm:h-12 text-sm sm:text-base rounded-full object-cover`}
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="text-white font-bold">
          {currency.charAt(0)}
        </span>
      )}
    </div>
  );
}

