import https from 'https';

const secret = '6LeEhJAUAAAAAJ3FRv7mwSQ4CX6XjPMiz78wN5mm';

export function verifyRecaptchaToken(token: string) {
  const options = {
    hostname: 'google.com',
    method: 'POST',
    path: '/recaptcha/api/siteverify?secret=' + secret + '&response=' + token
  };

  return new Promise<void>((resolve, reject) => {
    const makeCall = https.request(options, (res) => {
      res.on('data', (recaptchaResponse) => {
        recaptchaResponse = JSON.parse(recaptchaResponse.toString());
        if (recaptchaResponse.success) {
          resolve();
        }
        reject({error: recaptchaResponse['error-codes']});
      });
    });

    makeCall.end();
  });

}
