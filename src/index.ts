import * as auth from './routes/auth-api';
import * as email from './routes/email-api';
import bodyParser from 'body-parser';
import clientAssets from './routes/serve-assets';
import clientCore from './routes/serve-client-core';
import dotenv from 'dotenv';
import express from 'express';
import {localStrategyConfig} from './controllers/passport';
import logger from 'morgan';
import passport from 'passport';
import Session from 'express-session';
dotenv.config();
// dotenv.config({path: 'server/.env'});


localStrategyConfig(passport);
auth.authRoutes(passport);

// TODO Document/Comment server application
const app = express();
const port = process.env.PORT || 3000;

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(Session({resave: false, saveUninitialized: false, secret: 'raiwind-road'}));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// router files can be found under src/routes
// using configured asset and core routers to serve angular front end application
app.use('/assets/*', clientAssets);
app.use('/auth', auth.router);
app.use('/email', email.router);
app.use('/', clientCore);

// start the Express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
