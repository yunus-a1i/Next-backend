// src/models/driveAttendies.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const driveAttendiesSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    interveiwPostId: {
      type: Schema.Types.ObjectId,
      ref: 'InterveiwPost',
      required: true,
    },
    resume: {
      type: String,
    },
  },
  { timestamps: true },
);

const DriveAttendies = mongoose.model('DriveAttendies', driveAttendiesSchema);
export default DriveAttendies;
