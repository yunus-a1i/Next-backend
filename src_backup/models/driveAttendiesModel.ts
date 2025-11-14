import mongoose, { Schema, Types, Document, Model } from 'mongoose';

export interface Idrive {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  interveiwPostId: Types.ObjectId;
  resume?: string;
}

export interface IdriveDocument extends Omit<Idrive, '_id'>, Document {
  _id: Types.ObjectId;
}

const driveAttendiesSchema = new mongoose.Schema<IdriveDocument>(
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

export const DriveAttendies: Model<IdriveDocument> = mongoose.model<IdriveDocument>('DriveAttendies', driveAttendiesSchema);
