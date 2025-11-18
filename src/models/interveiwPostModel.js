// src/models/interveiwPost.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    hrId: {
      type: Schema.Types.ObjectId,
      ref: 'Hr',
      required: true,
    },
    domainId: {
      type: Schema.Types.ObjectId,
      ref: 'Domain',
      // required: true
    },
    company: {
      type: String,
      required: [true, 'Company name is required.'],
    },
    title: {
      type: String,
      required: [true, 'Job title is required.'],
    },
    description: {
      type: String,
      required: [true, 'Description is required.'],
    },
    qualification: {
      type: String,
      required: [true, 'Qualification is required.'],
    },
    experience: {
      type: String,
      required: [true, 'Experience is required.'],
    },
    hiringDriveStart: {
      type: String,
      required: [true, 'Hiring drive start date is required.'],
    },
    hiringDriveEnd: {
      type: String,
      required: [true, 'Hiring drive end date is required.'],
    },
    time: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Location is required.'],
    },
    address: {
      type: String,
      required: [true, 'Address is required.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required.'],
    },
    salary: {
      type: String,
      required: [true, 'Salary is required.'],
    },
    vacancies: {
      type: Number,
      required: [true, 'OpenVacancies is required.'],
    },
    applicants: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    driveStatus: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const InterveiwPost = mongoose.model('InterveiwPost', postSchema);
export default InterveiwPost;
