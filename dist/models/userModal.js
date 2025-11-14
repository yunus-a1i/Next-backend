import bcrypt from 'bcryptjs';
import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
// Schemas for nested types
const ExperienceSchema = new Schema({
    company: { type: String, required: true },
    position: { type: String, required: true },
    period: { type: String, required: true },
    description: { type: String, required: true }
}, { _id: false });
const EducationSchema = new Schema({
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    period: { type: String, required: true }
}, { _id: false });
const ProjectSchema = new Schema({
    projectName: { type: String, required: true },
    projectLink: { type: String, required: true },
    projectDescription: { type: String }
}, { _id: false });
const UserSchema = new mongoose.Schema({
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
}, { timestamps: true });
// Save password in encrypted hash
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password, 10);
    return next();
});
UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};
// Short lived token
UserSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        user: this.name,
        email: this.email,
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2d' });
};
UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};
const User = mongoose.model('User', UserSchema);
export default User;
//# sourceMappingURL=userModal.js.map