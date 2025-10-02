import passportJwt from 'passport-jwt';
import { addToCurrentDir } from '../../generateKetPairs.js';
import Users from '../model/user.js';
import fs from 'fs/promises';

const pathToKey = addToCurrentDir('id_rsa_pub.pem');
const PUB_KEY = await fs.readFile(pathToKey, 'utf8');

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const option = {
  JwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithm: ["RS512"]
}


const  strategy = JwtStrategy(options, async (payload, done) => {
  try {
    const user = await Users.findOne({ _id: payload.sub });
    if (user) {
      return done(null, user);
    } else {
      return done(null, false)
    }

  } catch (error) {
    done(error, null)
  }

})
// TODO
export default (passport) => {
  passport.use(strategy)
}
