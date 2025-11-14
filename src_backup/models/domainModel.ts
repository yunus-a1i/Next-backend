import mongoose, { Types, Document, Model } from 'mongoose';

export interface Idomain {
  _id: Types.ObjectId;
  domainName: string;
}

export interface IdomainDocument extends Omit<Idomain, '_id'>, Document {
  _id: Types.ObjectId;
}


const domainSchema = new mongoose.Schema<IdomainDocument>(
  {
    domainName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Domain: Model<IdomainDocument> = mongoose.model<IdomainDocument>('Domain', domainSchema);
