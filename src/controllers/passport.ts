import * as dbLink from './db-link';
import * as localStrategy from 'passport-local';

const Strategy = localStrategy.Strategy;
export function localStrategyConfig(passport: any) {
  passport.serializeUser((user: any, cb: any) => {
    cb(null, user._id);
  });

  passport.deserializeUser((id: string, cb: any) => {
    dbLink.findUserById(id, (err: Error, user: any) => {
      if (err) {
        return cb(err);
      }
      cb(null, user);
    });
  });

  // Configuring the local strategy for use by Passport
  passport.use(new Strategy((username: string, password: string, cb) => {
    dbLink.findUserAuth(username, (err: any, user: any, info: any) => {
      if (err) {
        return cb(err);
      }
      if (!user) {
        return cb(null, false, info);
      }
      dbLink.verifyPassword(user.password, password).then((passCheck) => {
        if (!passCheck) {
          return cb(null, false, { message: 'Wrong Password or Username!'});
        }
        return cb(null, user);
      }).catch((error) => {
        error.source = 'findUserAuth.' + error.source;
        return cb(error);
      });
    });
  }));
}
