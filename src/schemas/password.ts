import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const PasswordSchema = new Schema({
  hash: String,
  iterations: Number,
  salt: String
});

export const PasswordModel = mongoose.model('password', PasswordSchema);
