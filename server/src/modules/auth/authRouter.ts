import { Router } from 'express';

import { loginHandler, logoutHandler, signupHandler } from './authHandlers';

export const authRouter = Router();

authRouter.post('/login', loginHandler);
authRouter.post('/signup', signupHandler, loginHandler);
authRouter.post('/logout', logoutHandler);
