import crypto from 'crypto';
import EventEmitter from 'events';
// import mongoose from 'mongoose';
import {Password} from '../models/password';
import {PasswordModel} from '../schemas/password';
import {Users} from '../schemas/users';

// mongoose.connect('mongodb://localhost:27017/portfolio-app', {useNewUrlParser: true});

class Emitter extends EventEmitter {
}

export function findUserAuth(username: string, cb: any) {
  Users.find({username}).limit(1).then((user: any) => {
    if (user.length < 1) {
      return cb(null, null, {message: 'Wrong Password or Username!'});
    } else {
      return cb(null, user[0]);
    }
  }).catch((err: any) => {
    return cb(err);
  });
}

// TODO Add user data validation function
export function findUserById(id: string, cb: any) {
  Users.find({_id: id}).then((user: any) => {
    if (user.length < 1) {
      cb(new Error('User ' + id + ' does not exist in our system!'));
    } else {
      cb(null, user);
    }
  });
}

function checkExistingUser(username: string, emailAddress: string) {
  return new Promise<any>((resolve, reject) => {
    const recordCheck = new Emitter();
    let userExists = false;
    let emailExists = false;
    let userChecked = false;
    let emailChecked = false;

    recordCheck.on('check', () => {
      if (userChecked && emailChecked) {
        if (userExists || emailExists) {
          if (userExists && emailExists) {
            recordCheck.removeAllListeners();
            resolve({exists: true, type: ['user', 'email']});
          } else if (userExists) {
            recordCheck.removeAllListeners();
            resolve({exists: true, type: ['user']});
          } else {
            recordCheck.removeAllListeners();
            resolve({exists: true, type: ['email']});
          }
        } else {
          resolve({exists: false});
        }
      }
    });

    Users.find({username}).limit(1).then((user: any) => {
      if (user.length >= 1) {
        userExists = true;
      }
      userChecked = true;
      recordCheck.emit('check');
    }).catch((err: any) => {
      reject(err);
    });

    Users.find({email: emailAddress}).then((email: any) => {
      if (email.length >= 1) {
        emailExists = true;
      }
      emailChecked = true;
      recordCheck.emit('check');
    }).catch((err: any) => {
      reject(err);
    });
  });

}

export function insertUser(username: string, password: string, displayName: string, email: string) {
  return new Promise<void>((resolve, reject) => {
    checkExistingUser(username, email).then((response) => {
      const checkResponse = JSON.parse(JSON.stringify(response));
      if (!checkResponse.exists) {
        securePassword(password).then((securePass) => {
          const user = new Users({displayName, email, password: securePass, username});
          user.save().then(() => resolve())
            .catch((err) => reject({error: err, source: 'insertUser.checkExistingUser.securePassword.user'}));
        }).catch((err) => {
          reject(err);
        });
      } else {
        resolve(checkResponse);
      }
    });
  });
}

export function securePassword(password: string) {
  return new Promise((resolve, reject) => {
    const iterations = 100000;
    generateSalt(iterations).then((saltObj) => {
      const salt = JSON.stringify(saltObj);
      crypto.pbkdf2(password, salt, iterations, 512, 'sha512', (err, derivedKey) => {
        if (err) {
          reject({error: err, source: 'securePassword.crypto.pbkdf2'});
        }
        resolve(new PasswordModel({hash: derivedKey.toString(), iterations, salt}));
      });
    }).catch((err) => {
      reject(err);
    });
  });
}

function passwordHash(password: string, salt: string, iterations: number, keylen: number, digest: string) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, derivedKey) => {
      if (err) {
        // return error
        reject({error: err, source: 'passwordHash.crypto.pbkdf2'});
      }
      resolve(derivedKey);
    });
  });
  }

export function verifyPassword(savedPassword: Password, password: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    passwordHash(password, savedPassword.salt, savedPassword.iterations, 512, 'sha512').then((newHash: any) => {
      resolve(savedPassword.hash === newHash.toString());
    }).catch((err) => {
      err.source = 'verifyPassword.' + err.source;
      reject(err);
    });
  });
}

/**
 * generate random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string
 */

function generateSalt(length: number) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(Math.ceil(length / 2), (err, buffer) => {
      if (err) {
        reject({error: err, source: 'generateSalt'});
      }
      resolve(buffer.toString('hex') /** convert to hexadecimal format */
        .slice(0, length)); /** return required number of characters */
    });
  });
}
// TODO Write Unit Test Cases
