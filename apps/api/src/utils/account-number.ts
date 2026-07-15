export function generateAccountNumber(): string {
  const BANK_PREFIX = "32";
  const RANDOM_LENGTH = 9;

  let accountNumber = BANK_PREFIX;

  for (let i = 0; i < RANDOM_LENGTH; i++) {
    accountNumber += Math.floor(Math.random() * 10);
  }

  return accountNumber;
}