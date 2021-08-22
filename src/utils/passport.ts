import { FacebookAuthError } from '../errors/facebookAuthError';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { User } from '../models/user';
import { PassportStatic } from 'passport';
import { QueryFailedError } from 'typeorm';
import { facebookPassportOptions } from '../../config/passportAuthOptions';
import { AuthProvider } from '../models/auth_provider';
import { logger } from '../../config/logger';

async function createAuthUser(accessToken: string, profile: any): Promise<User> {
  const { id, displayName, provider: prov, _json } = profile;
  const { email } = _json;

  const oldUser: User | undefined = await User.findOne({ where: { email } });
  if (oldUser) {
    oldUser.generateJWToken();
    // TODO: Add logic here if they login in a different provider?? but put in user model
    return oldUser;
  }
  try {
    const newUser: User = await User.create({
      username: displayName,
      email,
      password: 'IDontKnow1!WhatToD0', // FIXME: for now a workaround to prevent not null constraint
      accessToken
    } as User).save();
    newUser.generateJWToken();

    await AuthProvider.create({ provider_id: id, platform: prov, user: newUser } as AuthProvider).save();
    return newUser;
  } catch (error) {
    throw error;
  }
}

export const passportUtils = (passport: PassportStatic) => {
  passport.serializeUser(function (req: any, user: any, done: any) {
    // console.log('serializeUser1', user);
    done(null, user);
  });

  passport.deserializeUser(function (req: any, user: any, done: any) {
    // console.log('deserializeUser', user);
    done(null, user);
  });

  /**
   * Facebook Strategy
   */
  passport.use(
    new FacebookStrategy(facebookPassportOptions, async (accessToken, refreshToken, profile, done) => {
      try {
        const user: User = await createAuthUser(accessToken, profile);
        done(null, user);
      } catch (error) {
        // https://stackoverflow.com/questions/15711127/express-passport-node-js-error-handling
        if (error instanceof QueryFailedError) {
          done(null, false); // this will trigger failureRedirect
        } else {
          done(new FacebookAuthError(error));
        }
      }
    })
  );
};
