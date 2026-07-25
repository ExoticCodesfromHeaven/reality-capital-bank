import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { investmentService } from "./investment.service";

export const investmentController = {

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {

      const investment =
        await investmentService.createInvestment(

          req.user.id,

          req.body.accountId,

          req.body.amount,

          req.body.durationMonths

        );

      res.status(201).json({

        success: true,

        message:
          "Investment created successfully.",

        data: investment,

      });

    } catch (error) {

      next(error);

    }

  },



  async getMine(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {

      const investments =
        await investmentService.getMyInvestments(
          req.user.id
        );

      res.json({

        success: true,

        data: investments,

      });

    } catch (error) {

      next(error);

    }

  },



  async getOne(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {

    try {

      const investment =
        await investmentService.getInvestment(

          req.params.id,

          req.user.id

        );

      res.json({

        success: true,

        data: investment,

      });

    } catch (error) {

      next(error);

    }

  },

  async withdraw(

    req:Request<{id:string}>,

    res:Response,

    next:NextFunction

){

    try{

        await investmentService.withdrawInvestment(

            req.params.id,

            req.user.id

        );

        res.json({

            success:true,

            message:
                "Investment withdrawn successfully."

        });

    }

    catch(error){

        next(error);

    }

}

};