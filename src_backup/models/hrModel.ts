import bcrypt from 'bcryptjs';
import mongoose, { Document, Model, Types, Schema } from 'mongoose';
import jwt, { type Secret } from 'jsonwebtoken';

// Experience and Education Types
export type HrExperience = {
  company?: string;
  position?: string;
  period?: string;
  description?: string;
};
export type HrEducation = {
  institution?: string;
  degree?: string;
  period?: string;
};

// HR Base Interface (No _id)
export interface IhrBase {
  name: string;
  password: string;
  email: string;
  contact: string;
  location?: string;
  previousHiredNumber?: number;
  jobPostCount?: number;
  totalHiringDriveCount?: number;
  company?: string;
  city?: string;
  state?: string;
  country?: string;
  profilePhotoUrl?: string;
  accessToken?: string;
  refreshToken?: string;
  bio?: string;
  skills?: string[];
  experience?: HrExperience[];
  education?: HrEducation[];
  role?: string;
}

// HR Document Interface (With _id and Document methods)
export interface IhrDocument extends IhrBase, Document<Types.ObjectId> {
  _id: Types.ObjectId;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

// HR Model Type
export interface HrModel extends Model<IhrDocument> {}

// Schema Definitions
const HrExperienceSchema = new Schema<HrExperience>(
  {
    company: String,
    position: String,
    period: String,
    description: String,
  },
  { _id: false }
);

const HrEducationSchema = new Schema<HrEducation>(
  {
    institution: String,
    degree: String,
    period: String,
  },
  { _id: false }
);

const HrSchema = new mongoose.Schema<IhrDocument, HrModel>(
  {
    name: {
      type: String,
      required: true,
      minLength: [1, 'Name must have atleast 1 character.'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minLength: [1, 'Email is required.'],
    },
    password: {
      type: String,
      required: true,
      minLength: [1, 'Password is required.'],
    },
    contact: {
      type: String,
      unique: true,
      required: true,
      minLength: [10, 'Contact number is required.'],
    },
    location: {
      type: String,
    },
    previousHiredNumber: {
      type: Number,
    },
    jobPostCount: {
      type: Number,
    },
    totalHiringDriveCount: {
      type: Number,
    },
    company: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    profilePhotoUrl: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    bio: {
      type: String,
    },
    skills: [{ type: String }],
    experience: [HrExperienceSchema],
    education: [HrEducationSchema],
    role: { type: String, default: "recruiter" },
  },
  { timestamps: true }
);

// save password in encrypted hash
HrSchema.pre<IhrDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

HrSchema.methods.isPasswordCorrect = async function (
  this: IhrDocument,
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// short lived token
HrSchema.methods.generateAccessToken = function (this: IhrDocument): string {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET as Secret,
    { expiresIn: '2d' }
  );
};

// long lived token
HrSchema.methods.generateRefreshToken = function (this: IhrDocument): string {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as Secret,
    { expiresIn: '7d' }
  );
};

const Hr = mongoose.model<IhrDocument, HrModel>('Hr', HrSchema);
export default Hr;
