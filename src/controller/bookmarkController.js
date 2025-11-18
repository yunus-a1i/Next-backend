// src/controller/bookmarkController.js
import Bookmark from '../models/bookmarkModel.js';
import InterveiwPost from '../models/interveiwPostModel.js';

/**
 * Add a bookmark for the logged-in user
 * POST /bookmark
 * body: { interveiwPostId }
 */
export async function addBookmark(req, res, next) {
  try {
    const user = req.user;
    if (!user || !user._id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { interveiwPostId } = req.body;
    if (!interveiwPostId) {
      return res.status(400).json({ success: false, message: 'interveiwPostId is required.' });
    }

    // check post exists
    const post = await InterveiwPost.findById(interveiwPostId).select('_id jobTitle company');
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    // create bookmark (avoid duplicates)
    try {
      const bookmark = new Bookmark({
        userId: user._id,
        interveiwPostId,
      });
      const saved = await bookmark.save();

      return res.status(201).json({
        success: true,
        message: 'Bookmarked successfully.',
        data: saved,
      });
    } catch (err) {
      // duplicate key -> already bookmarked
      if (err && err.code === 11000) {
        return res.status(200).json({
          success: true,
          message: 'Already bookmarked.',
        });
      }
      throw err;
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Remove a bookmark
 * DELETE /bookmark/:id  (bookmark document id)
 * or DELETE /bookmark?postId=...  (by post id for current user)
 */
export async function removeBookmark(req, res, next) {
  try {
    const user = req.user;
    if (!user || !user._id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const bookmarkId = req.params.id;
    const postId = req.query.postId;

    let removed;

    if (bookmarkId) {
      // ensure bookmark belongs to user
      const bookmark = await Bookmark.findById(bookmarkId);
      if (!bookmark) {
        return res.status(404).json({ success: false, message: 'Bookmark not found.' });
      }
      if (bookmark.userId.toString() !== user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Forbidden.' });
      }
      removed = await Bookmark.findByIdAndDelete(bookmarkId);
    } else if (postId) {
      removed = await Bookmark.findOneAndDelete({ userId: user._id, interveiwPostId: postId });
    } else {
      return res.status(400).json({ success: false, message: 'bookmark id or postId is required.' });
    }

    if (!removed) {
      return res.status(404).json({ success: false, message: 'Bookmark not found.' });
    }

    return res.status(200).json({ success: true, message: 'Bookmark removed.', data: removed });
  } catch (error) {
    next(error);
  }
}

/**
 * Get paginated bookmarks for current user
 * GET /bookmarks?limit=10&page=1
 */
export async function getUserBookmarks(req, res, next) {
  try {
    const user = req.user;
    if (!user || !user._id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const limit = Math.max(parseInt(String(req.query.limit || '10'), 10), 1);
    const page = Math.max(parseInt(String(req.query.page || '1'), 10), 1);
    const skip = (page - 1) * limit;

    const [bookmarks, total] = await Promise.all([
      Bookmark.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({ path: 'interveiwPostId', select: 'jobTitle company hiringDriveStart hiringDriveEnd' })
        .lean(),
      Bookmark.countDocuments({ userId: user._id }),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Bookmarks fetched successfully.',
      data: bookmarks,
      pagination: {
        total,
        page,
        limit,
        hasMore: skip + limit < total,
      },
    });
  } catch (error) {
    next(error);
  }
}
