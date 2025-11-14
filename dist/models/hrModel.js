import bcrypt from 'bcryptjs';
import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
// Schema Definitions
const HrExperienceSchema = new Schema({
    company: String,
    position: String,
    period: String,
    description: String,
}, { _id: false });
const HrEducationSchema = new Schema({
    institution: String,
    degree: String,
    period: String,
}, { _id: false });
const HrSchema = new mongoose.Schema({
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
}, { timestamps: true });
// save password in encrypted hash
HrSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password, 10);
    return next();
});
HrSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};
// short lived token
HrSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2d' });
};
// long lived token
HrSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};
const Hr = mongoose.model('Hr', HrSchema);
export default Hr;
//# sourceMappingURL=hrModel.js.map