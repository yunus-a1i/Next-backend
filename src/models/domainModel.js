// src/models/domain.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const domainSchema = new Schema(
  {
    domainName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Domain = mongoose.model('Domain', domainSchema);
export default Domain;
