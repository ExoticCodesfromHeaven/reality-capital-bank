import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware";

import { authorize } from "../../middlewares/authorize.middleware";

import { validate } from "../../middlewares/validate.middleware";

import { supportController } from "./support.controller";

import { supportUpload } from "./support.upload";

import { deleteMessage } from "./support.controller";

import {

  createTicketSchema,

  replySchema,

  updateStatusSchema,

  sendMessageSchema,

} from "./support.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Customer
|--------------------------------------------------------------------------
*/

router.post(

  "/",

  authMiddleware,

  authorize(
    "CUSTOMER",
    "ADMIN",
    "SUPER_ADMIN"
  ),

  validate(createTicketSchema),

  supportController.createTicket

);

router.get(

  "/",

  authMiddleware,

  authorize(
    "CUSTOMER",
    "ADMIN",
    "SUPER_ADMIN"
  ),

  supportController.getMyTickets

);

router.get(

  "/:id",

  authMiddleware,

  authorize(
    "CUSTOMER",
    "ADMIN",
    "SUPER_ADMIN"
  ),

  supportController.getTicket

);


router.post(

  "/:ticketId/messages",

  authMiddleware,

  authorize(
    "CUSTOMER",
    "ADMIN",
    "SUPER_ADMIN"
  ),

  supportUpload.single("attachment"),

  validate(sendMessageSchema),

  supportController.sendMessage

);

router.get(

  "/:ticketId/messages",

  authMiddleware,

  authorize(
    "CUSTOMER",
    "ADMIN",
    "SUPER_ADMIN"
  ),

  supportController.getMessages

);

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

router.get(

  "/admin/all",

  authMiddleware,

  authorize(
    "ADMIN",
    "SUPER_ADMIN"
  ),

  supportController.getAllTickets

);

router.patch(

  "/admin/:id/assign",

  authMiddleware,

  authorize(
    "ADMIN",
    "SUPER_ADMIN"
  ),

  supportController.assignTicket

);

router.patch(

  "/admin/:id/status",

  authMiddleware,

  authorize(
    "ADMIN",
    "SUPER_ADMIN"
  ),

  validate(updateStatusSchema),

  supportController.updateStatus

);

router.patch(
  "/messages/:messageId",
  authMiddleware,
  authorize(
    "CUSTOMER",
    "ADMIN",
    "SUPER_ADMIN"
  ),
  validate(updateStatusSchema),
  supportController.sendMessage
);

router.delete(

  "/messages/:messageId",

  authMiddleware,

  authorize(
    "CUSTOMER",
    "ADMIN",
    "SUPER_ADMIN"
  ),

  deleteMessage

);

export default router;