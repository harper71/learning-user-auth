import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "please create a username"],
    minLength: 6
  },
  hash: { type: String },
  salt: { type: String },
  admin: {type: Boolean},
})

const Users = mongoose.model('users', UserSchema);

export default Users;
