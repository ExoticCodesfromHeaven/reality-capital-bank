import crypto from "crypto";

export function generateReference() {
  return crypto
    .randomUUID()
    .replace(/-/g, "")
    .toUpperCase();
}