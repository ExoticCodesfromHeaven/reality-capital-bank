// import { authRepository } from "../modules/auth/auth.repository";

// export async function isUsernameAvailable(
//   username: string
// ): Promise<boolean> {
//   const existingUser = await authRepository.findByUsername(
//     username.toLowerCase()
//   );

//   return !existingUser;
// }

// export function normalizeUsername(username: string): string {
//   return username.trim().toLowerCase();
// }

import { authRepository } from "../modules/auth/auth.repository";

export async function isUsernameAvailable(
  username: string
): Promise<boolean> {
  const existingUser = await authRepository.findByUsername(username);

  return !existingUser;
}