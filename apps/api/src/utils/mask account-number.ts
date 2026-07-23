export function maskAccountNumber(
  accountNumber: string
) {
  if (accountNumber.length <= 4) {
    return accountNumber;
  }

  const visible = 4;

  return (
    "*".repeat(accountNumber.length - visible) +
    accountNumber.slice(-visible)
  );
}