import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const { Schema } = mongoose;

const HrExperienceSchema = new Schema(
  {
    company: String,
    position: String,
    period: String,
    description: String,
  },
  { _id: false },
);

const HrEducationSchema = new Schema(
  {
    institution: String,
    degree: String,
    period: String,
  },
  { _id: false },
);

const HrSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [1, 'Name must have at least 1 character.'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minLength: [1, 'Email is required.'],
    },

    // 👇 NEW: authProvider + googleId
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    password: {
      type: String,
      required: function () {
        return this.authProvider === 'local';
      },
      minLength: [1, 'Password is required.'],
    },
    contact: {
      type: String,
      unique: true,
      required: false, // relax for Google users; you can enforce later in UI
      minLength: [10, 'Contact number is required.'],
    },

    previousHiredNumber: Number,
    jobPostCount: Number,
    totalHiringDriveCount: Number,

    company: String,
    city: String,
    state: String,
    country: String,

    profilePhotoUrl: String,
    accessToken: String,
    refreshToken: String,
    bio: String,

    skills: [String],
    experience: [HrExperienceSchema],
    education: [HrEducationSchema],

    role: { type: String, default: 'recruiter' },
  },
  { timestamps: true },
);

HrSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  } catch (err) {
    return next(err);
  }
});

HrSchema.methods.isPasswordCorrect = async function (password) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

HrSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '2d' },
  );
};

HrSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' },
  );
};

const Hr = mongoose.model('Hr', HrSchema);
export default Hr;
