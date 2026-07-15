export function generateAccountName(
  firstName: string,
  lastName: string
): string {
  return `${firstName} ${lastName}`.toUpperCase();
}