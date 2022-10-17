import express from 'express';
import {sendEmail} from '../controllers/email';
import {verifyRecaptchaToken} from '../controllers/recaptcha';

const router = express.Router();

router.post('/send', (req, res) => {
  verifyRecaptchaToken(String(req.headers['recaptcha-token']))
    .then(() => {
      sendEmail(req.body)
        .then((status) => {
          res.send(status);
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    })
    .catch((err) => {
      process.stdout.write('email-api/send/verifyRecaptchaToken -> Fail:\n');
      process.stdout.write(JSON.stringify(err));
      process.stdout.write('\n');
      res.status(400).send(JSON.stringify(err));
    });
});

export {router};
