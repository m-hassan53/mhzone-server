import mongoose from 'mongoose';
import {PasswordSchema} from './password';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  displayName: String,
  email: String,
  password: PasswordSchema,
  username: String
});

export const Users = mongoose.model('users', userSchema);
