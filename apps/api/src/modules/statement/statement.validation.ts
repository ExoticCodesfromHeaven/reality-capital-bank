import { z } from "zod";
import {
  TransactionCategory,
  TransactionType,
} from "@prisma/client";

export const statementSchema = z.object({
  from: z.string().optional(),

  to: z.string().optional(),

  type: z.nativeEnum(TransactionType).optional(),

  category: z.nativeEnum(TransactionCategory).optional(),
});

export type StatementQuery =
  z.infer<typeof statementSchema>;