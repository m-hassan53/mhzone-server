import {Email, Message} from '../models/email.model';
import sendgrid from '@sendgrid/mail';

export function sendEmail(data: Message) {
  const email: Email = transformEmailData(data);
  sendgrid.setApiKey(process.env?.SENDGRID_API_KEY as string);
  return sendgrid.send(email)
    .then(() => {
      return {publisher: 'sendGrid-api', status: 'success'};
    })
    .catch((error) => {
      return {data: error, publisher: 'sendGrid-api', status: 'error'};
    });
}

function transformEmailData(data: Message): Email {
  return {
    from: {
      email: process?.env?.VERIFIED_SENDER_EMAIL as string,
      name: data?.fromName
    },
    subject: data?.subject,
    text: data?.text,
    to: process?.env?.RECEIVER_EMAIL as string
  };
}
