import { prisma } from "../lib/prisma";

export async function generateTicketNumber() {

  const total =
    await prisma.supportTicket.count();

  return `RCT-${String(total + 1).padStart(6, "0")}`;

}