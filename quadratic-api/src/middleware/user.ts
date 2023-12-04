import { NextFunction, Response } from 'express';
import dbClient from '../dbClient';
import { Request, RequestWithAuth, RequestWithUser } from '../types/Request';

const getOrCreateUser = async (auth0_id: string) => {
  // get user from db
  let user = await dbClient.user.findUnique({
    where: {
      auth0_id,
    },
  });

  // if not user, create user
  if (user === null) {
    user = await dbClient.user.create({
      data: {
        auth0_id,
      },
    });
  }

  return user;
};

export const userMiddleware = async (req: RequestWithAuth, res: Response, next: NextFunction) => {
  // if (req.auth?.sub === undefined) {
  //   return res.status(401).json({ error: { message: 'Invalid authorization token' } });
  // }

  // const user = await getOrCreateUser(req.auth.sub);
  // if (!user) {
  //   return res.status(500).json({ error: { message: 'Unable to get authenticated user' } });
  // }

  (req as RequestWithUser).user = await getOrCreateUser(req.auth.sub);
  next();
};

export const userOptionalMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (req.auth?.sub === undefined) {
    return next();
  }

  req.user = await getOrCreateUser(req.auth.sub);

  next();
};
