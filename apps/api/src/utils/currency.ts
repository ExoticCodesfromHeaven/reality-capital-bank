export function formatMoney(
  amount: number | string,
  symbol: string
) {
  return `${symbol}${Number(amount).toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}