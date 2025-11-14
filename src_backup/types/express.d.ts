import type { Iuser } from '../models/userModal.ts';
import type { Ihr } from '../models/hrModel.ts';

declare global {
  namespace Express {
    interface Request {
      user?: Iuser | Ihr;
    }
  }
}
