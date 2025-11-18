// src/controller/interveiwPostController.js
import InterveiwPost from '../models/interveiwPostModel.js';

export async function createPost(req, res, next) {
  try {
    const {
      hrId,
      title,
      company,
      description,
      qualification,
      experience,
      hiringDriveStart,
      hiringDriveEnd,
      location,
      address,
      email,
      phone,
      salary,
      vacancies,
      driveStatus,
      domainId,
    } = req.body;

    // Required fields check
    if (
      !(
        hrId &&
        title &&
        company &&
        description &&
        qualification &&
        experience &&
        hiringDriveStart &&
        hiringDriveEnd &&
        location &&
        address &&
        email &&
        phone &&
        salary &&
        vacancies !== undefined &&
        driveStatus !== undefined
      )
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    let post = new InterveiwPost({
      hrId,
      domainId,
      title,
      company,
      description,
      qualification,
      experience,
      hiringDriveStart,
      hiringDriveEnd,
      location,
      address,
      email,
      phone,
      salary,
      vacancies,
      driveStatus,
    });

    post = await post.save();

    return res.status(201).json({
      success: true,
      message: 'Post created successfully.',
      data: post,
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePost(req, res, next) {
  try {
    const {
      hrId,
      domainId,
      title,
      description,
      qualification,
      experience,
      hiringDriveStart,
      hiringDriveEnd,
      location,
      address,
      email,
      phone,
      salary,
      vacancies,
      driveStatus,
    } = req.body;

    const { id } = req.params;
    if (
      !(
        id &&
        hrId &&
        domainId &&
        title &&
        description &&
        qualification &&
        experience &&
        hiringDriveStart &&
        hiringDriveEnd &&
        location &&
        address &&
        email &&
        phone &&
        salary &&
        vacancies !== undefined &&
        driveStatus !== undefined
      )
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    const post = await InterveiwPost.findByIdAndUpdate(
      id,
      {
        domainId,
        title,
        description,
        qualification,
        experience,
        hiringDriveStart,
        hiringDriveEnd,
        location,
        address,
        email,
        phone,
        salary,
        vacancies,
        driveStatus,
      },
      { new: true },
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Post updated successfully.',
      data: post,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPosts(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'HrId is required.',
      });
    }
    const posts = await InterveiwPost.find({ hrId: id });

    return res.status(200).json({
      success: true,
      message: 'All posts fetched successfully.',
      data: posts ?? [],
    });
  } catch (error) {
    next(error);
  }
}

export async function deletePost(req, res, next) {
  try {
    const { hrId } = req.body;
    const { id } = req.params;
    if (!(id && hrId)) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }
    const post = await InterveiwPost.findOneAndDelete({ _id: id, hrId: hrId });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully.',
      data: post,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllPosts(req, res, next) {
  try {
    const limit = parseInt(req.query.limit, 10) || 4;
    const page = parseInt(req.query.page, 10) || 1;
    const skip = (page - 1) * limit;

    const posts = await InterveiwPost.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

    const total = await InterveiwPost.countDocuments();

    return res.status(200).json({
      success: true,
      message: 'Posts fetched successfully.',
      data: posts,
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

export async function getAllPostsFull(req, res, next) {
  try {
    const posts = await InterveiwPost.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'All posts fetched successfully.',
      data: posts,
      total: posts.length,
    });
  } catch (error) {
    next(error);
  }
}
