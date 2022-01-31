import { Handler, Request } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import Joi from 'joi';
import createError from 'http-errors';

import type { User, UserPassword } from '@prisma/client';
import {
  createUser,
  getUserByEmail,
  getUserById,
} from '@/datasources/serverDb/modules/user';
import { verifyUserPasswordByEmail } from '@/datasources/serverDb/modules/userPassword';

passport.serializeUser<string, Request>((req, user, done): void => {
  done(null, user.userId);
});

// Deserialize the value that came from session or PassportStrategy verifyFunction
passport.deserializeUser<string, Request>(async (req, userId, done) => {
  const { serverDb } = req.context();
  const user = await getUserById(serverDb, userId);

  done(null, user);
});

const loginSchema = Joi.object().keys({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().min(8).required().strip(),
});

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    async (req, email, password, done): Promise<void> => {
      const { serverDb } = req.context();

      const { error } = loginSchema.validate({ email, password });
      if (error) {
        return done(createError(400, error));
      }

      try {
        const userVerified = await verifyUserPasswordByEmail(serverDb, {
          email,
          password,
        });
        if (!userVerified) {
          return done(null, false);
        }

        const user = await getUserByEmail(serverDb, email);

        // This will be passed to passport.serializeUser
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

export const loginHandler: Handler = (req, res, next): void => {
  const authCallback = (err: any, user: any): any => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next(createError(401, 'Invalid credentials'));
    }

    req.logIn(user, (err): any => {
      if (err) {
        return next(err);
      }

      return res.json({
        data: user,
      });
    });
  };

  passport.authenticate('local', authCallback)(req, res, next);
};

const singupValidationSchema = Joi.object<{
  body: any;
}>({
  body: Joi.object<Omit<User, 'userId'> & Pick<UserPassword, 'password'>>({
    email: Joi.string().email().min(1).required(),
    password: Joi.string().min(5).required(),
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
  })
    .required()
    .unknown(),
})
  .required()
  .unknown();

export const signupHandler: Handler = async (req, res, next) => {
  const { serverDb } = req.context();

  const { error } = singupValidationSchema.validate(req);
  if (error) {
    return next(createError(400, error.message));
  }

  const { email, password: plaintextPassword, firstName, lastName } = req.body;
  const user = await getUserByEmail(serverDb, req.body?.email as string);

  if (user) {
    return next(createError(400, 'User with given email already exists!'));
  }

  await createUser(serverDb, {
    email,
    plaintextPassword,
    firstName,
    lastName,
  });

  return next();
};

export const logoutHandler: Handler = (req, res) => {
  req.logout();
  res.status(200).json({
    data: null,
  });
};

// TODO: NOT IN USE, BUT HANDY TO HAVE AROUND
/**
 * Checks if there is a valid user session.
 */
// export const authHandler: Handler = (req, _res, next): void => {
//   if (req.user) {
//     next();
//   } else {
//     next(createError(401, 'Not authenticated'));
//   }
// };
