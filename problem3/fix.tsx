interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

// Move getPriority outside component to avoid recreation on each render
const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case 'Osmosis':
      return 100;
    case 'Ethereum':
      return 50;
    case 'Arbitrum':
      return 30;
    case 'Zilliqa':
      return 20;
    case 'Neo':
      return 20;
    default:
      return -99;
  }
};

const WalletPage: React.FC<BoxProps> = (props) => {
  const { ...rest } = props;
  const balances: WalletBalance[] = useWalletBalances();
  const prices: Record<string, number> = usePrices();

  // Combine filtering, sorting, and formatting into a single memoized operation
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // Keep balances with valid priority and positive amounts
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        // Sort in descending order by priority
        return rightPriority - leftPriority;
      });
  }, [balances]);

  // Memoize the rows to prevent unnecessary re-renders
  const rows = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => {
      const formattedAmount = balance.amount.toFixed();
      const usdValue = prices[balance.currency] * balance.amount;
      
      return (
        <WalletRow
          className={classes.row}
          key={balance.currency}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={formattedAmount}
        />
      );
    });
  }, [sortedBalances, prices]);

  return <div {...rest}>{rows}</div>;
};