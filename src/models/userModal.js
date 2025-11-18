// src/models/userModel.js
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const { Schema } = mongoose;

/* Schemas for nested types (no TS generics in JS) */
const ExperienceSchema = new Schema(
  {
    company: { type: String, required: true },
    position: { type: String, required: true },
    period: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false },
);

const EducationSchema = new Schema(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    period: { type: String, required: true },
  },
  { _id: false },
);

const ProjectSchema = new Schema(
  {
    projectName: { type: String, required: true },
    projectLink: { type: String, required: true },
    projectDescription: { type: String },
  },
  { _id: false },
);

/* User schema */
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [1, 'Name must have at least 1 character.'],
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
    role: { type: String, default: 'candidate' },
  },
  { timestamps: true },
);

/* Pre-save hook: hash password if modified */
UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  } catch (err) {
    return next(err);
  }
});

/* Instance methods */
UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      user: this.name,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '2d' },
  );
};

UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

/* Export model */
const User = mongoose.model('User', UserSchema);
export default User;
