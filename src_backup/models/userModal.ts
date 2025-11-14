import bcrypt from 'bcryptjs';
import mongoose, {
  Model,
  Types,
  Document,
  Schema
} from 'mongoose';
import jwt, { type Secret } from 'jsonwebtoken';

// Types for embedded experience, education, and project
export type Experience = {
  company: string;
  position: string;
  period: string;
  description: string;
};

export type Education = {
  institution: string;
  degree: string;
  period: string;
};

export type Project = {
  projectName: string;
  projectLink: string;
  projectDescription?: string;
};

// Main user interface, with optional _id and typed arrays
export interface Iuser {
  _id?: Types.ObjectId;
  name: string;
  password: string;
  bio?: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
  email: string;
  contact?: string;
  resumeLink?: string;
  profilePhotoLink?: string;
  projects?: Project[];
  accessToken?: string;
  refreshToken?: string;
  domain?: string;
  role?: string;
}

// Used to provide instance methods for User model
export interface IuserMethods {
  isPasswordCorrect(this: IUserDocument, password: string): Promise<boolean>;
  generateAccessToken(this: IUserDocument): string;
  generateRefreshToken(this: IUserDocument): string;
}

// Document type with instance methods
export type IUserDocument = Iuser & Document<Types.ObjectId> & IuserMethods;

// Model type for statics
export type UserModel = Model<IUserDocument, {}, IuserMethods>;

// Schemas for nested types
const ExperienceSchema = new Schema<Experience>(
  {
    company: { type: String, required: true },
    position: { type: String, required: true },
    period: { type: String, required: true },
    description: { type: String, required: true }
  },
  { _id: false }
);

const EducationSchema = new Schema<Education>(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    period: { type: String, required: true }
  },
  { _id: false }
);

const ProjectSchema = new Schema<Project>(
  {
    projectName: { type: String, required: true },
    projectLink: { type: String, required: true },
    projectDescription: { type: String }
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema<IUserDocument, UserModel>(
  {
    name: {
      type: String,
      required: true,
      minLength: [1, 'Name must have atleast 1 character.'],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minLength: [1, 'Email is required.'],
    },
    contact: {
      type: String,
      unique: true,
      required: false,
      minLength: [10, 'Contact number is required.'],
    },
    resumeLink: {
      type: String,
    },
    bio: {
      type: String,
    },
    skills: {
      type: [String],
    },
    experience: {
      type: [ExperienceSchema],
    },
    education: {
      type: [EducationSchema],
    },
    profilePhotoLink: {
      type: String,
    },
    projects: {
      type: [ProjectSchema],
    },
    domain: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    role: { type: String, default: "candidate" },
  },
  { timestamps: true },
);

// Save password in encrypted hash
UserSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

UserSchema.methods.isPasswordCorrect = async function (
  this: IUserDocument,
  password: string
) {
  return await bcrypt.compare(password, this.password);
};

// Short lived token
UserSchema.methods.generateAccessToken = function (this: IUserDocument) {
  return jwt.sign(
    {
      _id: this._id,
      user: this.name,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET as Secret,
    { expiresIn: '2d' },
  );
};

UserSchema.methods.generateRefreshToken = function (this: IUserDocument) {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET as Secret,
    { expiresIn: '7d' }
  );
};

const User = mongoose.model<IUserDocument, UserModel>('User', UserSchema);
export default User;
