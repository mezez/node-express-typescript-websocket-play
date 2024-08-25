import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "../config";

const SALT_WORK_FACTOR = config.salt_work_factor;

//Extend schema
export interface IUser extends Document {
  _id: any;
  name: string;
  email: string;
  password: string;
}

//Extend model
export interface IUserModel extends Model<IUser> {
  comparePassword(
    candidatePassword: string,
    foundUserPassword: string
  ): boolean;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: { unique: true },
    },
    password: {
      type: String,
      required: true,
    },
    funds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Fund" }],
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();
  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

userSchema.statics.comparePassword = function (
  candidatePassword: string,
  foundUserPassword: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, foundUserPassword, (err, isMatch) => {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

export const User = mongoose.model<IUser, IUserModel>("User", userSchema);
// module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
