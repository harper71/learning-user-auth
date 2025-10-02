import crypto from "crypto";
import fs from "fs/promises";
import { addToCurrentDir } from "../../generateKetPairs.js";
import { promisify } from "util";
import jsonwebtoken from "jsonwebtoken";


const pathToKey = addToCurrentDir('id_rsa_priv.pem');
const PRIV_KEY = await fs.readFile(pathToKey, 'utf8');


const pbkdf2 = promisify(crypto.pbkdf2);


async function createPassword(password) {
  try {
    let salt = crypto.randomBytes(32).toString('hex');
    let genHash = (await pbkdf2(password, salt, 10000, 64, 'sha512')).toString('hex')

    return {
      salt: salt,
      hash: genHash,
    }
  } catch (error) {
    console.error(error);
  }

}

async function validatePassword(password, salt, hash) {
  const verifyHash = (await pbkdf2(password, salt, 10000, 64, 'sha512')).toString('hex');

  return hash === verifyHash;
}

function issueJWT(user) {
  const _id = user._id;
  const expiresIn = '1d';

  const payload = {
    sub: _id,
    iat: Date.now(),
  }

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS512' });

  return {
    token: `Bearer ${signedToken}`,
    expiresIn: expiresIn,
  }
}


export {
  validatePassword,
  createPassword,
  issueJWT
}
