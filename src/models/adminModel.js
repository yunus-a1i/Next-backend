// src/models/adminModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { Schema } = mongoose;

const AdminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [1, 'Name must have at least 1 character.'],
    },
    email: {
      type: String,
      unique: true,
      required: true,
      minLength: [1, 'Email is required.'],
    },
    password: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      default: 'admin',
    },
  },
  { timestamps: true }
);

// Encrypt password before save
AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

// Compare password
AdminSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Generate short-lived access token
AdminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      role: 'admin',
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '2d' }
  );
};

// Generate long-lived refresh token
AdminSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: 'admin',
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;
