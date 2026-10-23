import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { config } from '../config';

/* ── Types ── */
export type VerificationMethod = 'email_domain' | 'student_id' | 'manual';

export interface IUser {
  email: string;
  password: string;
  name: string;
  universityId?: string;
  is_verified: boolean;
  verificationMethod?: VerificationMethod;
  communityScore: number;
  totalItemsListed: number;
  totalBorrows: number;
  totalReturns: number;
  totalSaved: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserPublicProfile {
  id: string;
  _id: string;
  email: string;
  name: string;
  universityId?: string;
  is_verified: boolean;
  verificationMethod?: VerificationMethod;
  communityScore: number;
  totalItemsListed: number;
  totalBorrows: number;
  totalReturns: number;
  totalSaved: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  toPublicJSON(): IUserPublicProfile;
}

interface IUserModel extends Model<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;
}

/* ── Schema ── */
const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    universityId: {
      type: String,
      trim: true,
      maxlength: [50, 'University ID cannot exceed 50 characters'],
    },
    is_verified: {
      type: Boolean,
      default: false,
      index: true,
    },
    verificationMethod: {
      type: String,
      enum: {
        values: ['email_domain', 'student_id', 'manual'],
        message: 'Invalid verification method: {VALUE}',
      },
    },
    communityScore: {
      type: Number,
      default: 5.0,
      min: [0, 'Community score cannot fall below 0'],
      max: [5, 'Community score cannot exceed 5'],
    },
    totalItemsListed: { type: Number, default: 0, min: 0 },
    totalBorrows: { type: Number, default: 0, min: 0 },
    totalReturns: { type: Number, default: 0, min: 0 },
    totalSaved: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

/* ── Pre-save hook: Hash password + Auto-verify student emails ── */
userSchema.pre<IUserDocument>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, config.bcryptSaltRounds);
  }

  // Automatic Trust & Safety verification for acknowledged university domains
  if (this.isModified('email') && !this.is_verified) {
    const universityDomains = ['.edu', '.ac.', 'hhu.de', 'uni-', '.university'];
    const emailDomain = this.email.split('@')[1]?.toLowerCase() || '';
    const isUniversityEmail = universityDomains.some((d) => emailDomain.includes(d));
    if (isUniversityEmail) {
      this.is_verified = true;
      this.verificationMethod = 'email_domain';
    }
  }

  next();
});

/* ── Instance Methods ── */
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toPublicJSON = function (): IUserPublicProfile {
  const obj = this.toObject();
  const idStr = this._id.toString();
  return {
    id: idStr,
    _id: idStr,
    email: obj.email,
    name: obj.name,
    universityId: obj.universityId,
    is_verified: obj.is_verified,
    verificationMethod: obj.verificationMethod,
    communityScore: obj.communityScore,
    totalItemsListed: obj.totalItemsListed,
    totalBorrows: obj.totalBorrows,
    totalReturns: obj.totalReturns,
    totalSaved: obj.totalSaved,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

/* ── Static Methods ── */
userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);
export default User;
