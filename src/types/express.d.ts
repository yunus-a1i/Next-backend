import type { Iuser } from '../models/userModal.js';
import type { Ihr } from '../models/hrModel.js';

declare global {
  namespace Express {
    interface Request {
      user?: Iuser | Ihr;
    }
  }
}


