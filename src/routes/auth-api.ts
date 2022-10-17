import * as dbLink from '../controllers/db-link';
import express from 'express';

const router = express.Router();

function authRoutes(passport: any) {
  router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({authenticated: false, message: info.message, status: 'fail'});
      }
      req.logIn(user, (error) => {
        if (error) {
          return next(error);
        }
        return res.json({authenticated: true, status: 'success'});
      });
    })(req, res, next);
  });

  // router.post('/reset', (req, res) => {
  //   dbLink.securePassword('hassan').then((response) => {
  //     res.json({password: response});
  //   });
  // });

  router.post('/signup', (req, res) => {
    const userData = req.body.data;
    dbLink.insertUser(userData.username, userData.password, userData.displayName, userData.email)
      .then((response: any) => {
        if (response) {
          res.json({status: 'fail', ...response});
        } else {
          res.json({status: 'success'});
        }
      })
      .catch((err) => {
        res.json({error: err, status: 'fail'});
      });

  });
}

export {router, authRoutes};
