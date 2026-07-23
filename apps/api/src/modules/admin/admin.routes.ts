import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware";
import { authorize } from "../../middlewares/authorize.middleware";

import { adminController } from "./admin.controller";

import { adminTransferController } from "./admin.transfer.controller";

const router = Router();

router.get(
  "/dashboard",
  authMiddleware,
  authorize(
    "ADMIN",
    "SUPER_ADMIN"
  ),
  adminController.dashboard
);

router.get(
  "/users",
  authMiddleware,
  authorize(
    "ADMIN",
    "SUPER_ADMIN"
  ),
  adminController.getUsers
);

router.get(
  "/users/:id",
  authMiddleware,
  authorize(
    "ADMIN",
    "SUPER_ADMIN"
  ),
  adminController.getUser
);

router.patch(
  "/accounts/:id/freeze",
  authMiddleware,
  authorize(
    "ADMIN",
    "SUPER_ADMIN"
  ),
  adminController.freezeAccount
);

router.patch(
  "/accounts/:id/unfreeze",
  authMiddleware,
  authorize(
    "ADMIN",
    "SUPER_ADMIN"
  ),
  adminController.unfreezeAccount
);

router.get(

  "/transfers/pending",

  authMiddleware,

  authorize(
    "ADMIN",
    "SUPER_ADMIN"
  ),

  adminTransferController.getPendingTransfers

);



router.patch(

  "/transfers/:id/approve",

  authMiddleware,

  authorize(
    "ADMIN",
    "SUPER_ADMIN"
  ),

  adminTransferController.approveTransfer

);



router.patch(

  "/transfers/:id/reject",

  authMiddleware,

  authorize(
    "ADMIN",
    "SUPER_ADMIN"
  ),

  adminTransferController.rejectTransfer

);

router.get(
  "/transactions",
  authMiddleware,
  authorize(
    "ADMIN",
    "SUPER_ADMIN"
  ),
  adminController.getTransactions
);


router.get(
  "/transactions/:id",
  authMiddleware,
  authorize(
    "ADMIN",
    "SUPER_ADMIN"
  ),
  adminController.getTransaction
);

export default router;