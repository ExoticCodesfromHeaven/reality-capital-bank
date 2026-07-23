import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { adminTransferService } from "./admin.transfer.service";


export const adminTransferController = {


  async getPendingTransfers(
    _req: Request,
    res: Response,
    next: NextFunction
  ){

    try {

      const transfers =
        await adminTransferService
        .getPendingTransfers();


      res.json({

        success:true,

        data:transfers,

      });


    } catch(error){

      next(error);

    }

  },



  async approveTransfer(
    req: Request<{id:string}>,
    res: Response,
    next: NextFunction
  ){

    try {


      const userId = req.user?.id;
      if (!userId) {
        throw new Error("User not authenticated.");
      }

      const transfer =
        await adminTransferService
        .approveTransfer(

          req.params.id,

          userId

        );


      res.json({

        success:true,

        message:
          "Transfer approved successfully.",

        data:transfer,

      });


    }catch(error){

      next(error);

    }

  },



  async rejectTransfer(
    req: Request<
      {id:string},
      {},
      {
        reason:string
      }
    >,

    res: Response,
    next: NextFunction
  ){

    try {

      const userId = req.user?.id;
      if (!userId) {
        throw new Error("User not authenticated.");
      }

      const transfer =
        await adminTransferService
        .rejectTransfer(

          req.params.id,

          userId,

          req.body.reason

        );


      res.json({

        success:true,

        message:
          "Transfer rejected successfully.",

        data:transfer,

      });


    }catch(error){

      next(error);

    }

  },


};