import { Multer } from "multer";

declare global {
  namespace Express {

    interface UserPayload {
      id: string;
      role: string;
    }

    interface Request {
      user: UserPayload;
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
    }

  }
}

export {};