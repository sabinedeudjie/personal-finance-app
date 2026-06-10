import { Request } from 'express';

interface UserPayload {
  userId: string;
  email: string;
}

export interface RequestWithUser extends Request {
  user: UserPayload;
}
