import * as auth from './routes/auth-api';
import * as email from './routes/email-api';
import bodyParser from 'body-parser';
import clientAssets from './routes/serve-assets';
import clientCore from './routes/serve-client-core';
import cors from 'cors';
import express from 'express';
// import {localStrategyConfig} from './controllers/passport';
import logger from 'morgan';
// import passport from 'passport';
// import Session from 'express-session';

if (process.env.NODE_ENV !== 'production') {
  const importFrom = 'dotenv';
  import(importFrom).then(dotenv => {
    dotenv.config();
  });
}


// localStrategyConfig(passport);
// auth.authRoutes(passport);

const whitelist = [
  'https://www.mmhassan.ca',
  'https://mmhassan.ca'
];

if (process.env.NODE_ENV !== 'production') {
  whitelist.push('https://localhost:4200');
}

const corsOptions = {
  credentials: true,
  optionsSuccessStatus: 200,
  origin: function (origin: any, callback: any) {
    console.log('REQUEST ORIGIN: ', origin);
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// TODO Document/Comment server application
const app = express();
const port = process.env.PORT || 3000;

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(Session({resave: false, saveUninitialized: false, secret: 'raiwind-road'}));
app.use(cors(corsOptions));

// Initialize Passport and restore authentication state, if any, from the
// session.
// app.use(passport.initialize());
// app.use(passport.session());

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
