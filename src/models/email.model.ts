export interface Message {
  fromName: string;
  subject: string;
  text: string;
}

export interface Email {
  to: string;
  from: SenderInfo;
  subject: string;
  text: string;
}

export interface SenderInfo {
  email: string;
  name: string;
}
