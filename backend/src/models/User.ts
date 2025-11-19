import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto"

export interface IUser extends Document {
  email: string;
  fullName: string;
  phone?: string;
  password: string;
  profilePic?: string;
  verificationToken?: string;
  verificationTokenExpire?: Date;
  getResetPasswordToken(): string;
  getVerificationToken(): string;
}

export const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: false },
    password: { type: String, required: true, minLength: 6 },
    profilePic: {type: String, default: ""},
    verificationToken: String,
    verificationTokenExpire: Date,
  },
  { timestamps: true }
);

// ✅ Compare entered password
userSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Hash password before save
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Generate email verification token
userSchema.methods.getVerificationToken = function (): string {
  const verificationToken = crypto.randomBytes(20).toString("hex");
  this.verificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  this.verificationTokenExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return verificationToken;
};

export const User = mongoose.model<IUser>("User", userSchema);
