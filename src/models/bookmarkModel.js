// src/models/bookmarkModel.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const bookmarkSchema = new Schema(
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
  },
  { timestamps: true }
);

// prevent duplicate bookmarks at DB level (unique compound index)
bookmarkSchema.index({ userId: 1, interveiwPostId: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
export default Bookmark;
