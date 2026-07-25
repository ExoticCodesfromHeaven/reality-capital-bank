import { z } from "zod";

export const createTicketSchema = z.object({

  subject: z
    .string()
    .trim()
    .min(5)
    .max(150),

  category: z
    .string()
    .trim()
    .min(2)
    .max(50),

  priority: z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
    "URGENT",
  ]),

  message: z
    .string()
    .trim()
    .min(10)
    .max(5000),

});

export const replySchema = z.object({

  message: z
    .string()
    .trim()
    .min(2)
    .max(5000),

});

export const updateStatusSchema = z.object({

  status: z.enum([
    "OPEN",
    "IN_PROGRESS",
    "RESOLVED",
    "CLOSED",
  ]),

});

export type CreateTicketInput =
  z.infer<typeof createTicketSchema>;

export type ReplyInput =
  z.infer<typeof replySchema>;

export type UpdateStatusInput =
  z.infer<typeof updateStatusSchema>;

// export type AssignTicketInput =
//   z.infer<typeof assignTicketSchema>;