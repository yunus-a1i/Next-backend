// src/controller/hrController.js
import mongoose from 'mongoose';
import Hr from '../models/hrModel.js';
import DriveAttendies from '../models/driveAttendiesModel.js';
import InterveiwPost from '../models/interveiwPostModel.js';

export async function createHr(req, res, next) {
  try {
    const { name, email, password, contact } = req.body;
    if (!(name && email && password && contact)) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    // check for existing Hr
    const existingHr = await Hr.findOne({ email });
    if (existingHr) {
      return res.status(409).json({
        success: false,
        message: 'Hr already exists.',
      });
    }

    // create new Hr
    let hr = new Hr({ name, email, password, contact });
    hr = await hr.save();

    // remove password from the user
    const { password: _, ...userWithoutPassword } = hr.toObject();

    return res.status(201).json({
      success: true,
      message: 'Hr is created successfully.',
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function updateHr(req, res, next) {
  try {
    const { name, contact, company, city, state, country, bio, skills, experience, education, previousHiredNumber, jobPostCount, totalHiringDriveCount, profilePhotoUrl } =
      req.body;

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Id is required.',
      });
    }

    const existingHr = await Hr.findById(id);
    if (!existingHr) {
      return res.status(404).json({
        success: false,
        message: 'Hr not found',
      });
    }

    // Prepare update object
    const updateFields = {};

    if (name !== undefined) updateFields.name = name;
    if (contact !== undefined) updateFields.contact = contact;
    if (company !== undefined) updateFields.company = company;
    if (city !== undefined) updateFields.city = city;
    if (state !== undefined) updateFields.state = state;
    if (country !== undefined) updateFields.country = country;
    if (bio !== undefined) updateFields.bio = bio;
    if (profilePhotoUrl !== undefined) updateFields.profilePhotoUrl = profilePhotoUrl;
    if (previousHiredNumber !== undefined) updateFields.previousHiredNumber = previousHiredNumber;
    if (jobPostCount !== undefined) updateFields.jobPostCount = jobPostCount;
    if (totalHiringDriveCount !== undefined) updateFields.totalHiringDriveCount = totalHiringDriveCount;

    // Replace skills array if provided
    if (skills !== undefined) {
      if (!Array.isArray(skills)) {
        return res.status(400).json({
          success: false,
          message: 'Skills must be an array.',
        });
      }
      updateFields.skills = skills;
    }

    // Replace experience array if provided
    if (experience !== undefined) {
      if (!Array.isArray(experience)) {
        return res.status(400).json({
          success: false,
          message: 'Experience must be an array.',
        });
      }
      updateFields.experience = experience;
    }

    // Replace education array if provided
    if (education !== undefined) {
      if (!Array.isArray(education)) {
        return res.status(400).json({
          success: false,
          message: 'Education must be an array.',
        });
      }
      updateFields.education = education;
    }

    const updatedHr = await Hr.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    }).select('-password');

    return res.status(200).json({
      success: true,
      message: 'Hr updated successfully.',
      data: updatedHr,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function getHr(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Id is required.',
      });
    }

    const hr = await Hr.findById(id).select('-password');
    if (!hr) {
      return res.status(404).json({
        success: false,
        message: 'Hr not found.',
        data: hr,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Hr found.',
      data: hr,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function deleteHr(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'UserId is required.',
      });
    }

    const existingHr = await Hr.findById(id);
    if (!existingHr) {
      return res.status(404).json({
        success: false,
        message: 'Hr not found.',
      });
    }

    const deletedHr = await Hr.deleteOne({ _id: id });
    return res.status(200).json({
      success: true,
      message: 'Hr is deleted successfully.',
      data: deletedHr,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function getAllHr(req, res, next) {
  try {
    const hr = await Hr.find().select('-password');
    return res.status(200).json({
      success: true,
      message: 'Hr found.',
      data: hr,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function getAllPostsByHr(req, res, next) {
  try {
    const { id } = req.params; // hr id

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'HR id is required.',
      });
    }

    // check if hr exists
    const hrExists = await Hr.findById(id);
    if (!hrExists) {
      return res.status(404).json({
        success: false,
        message: 'HR not found.',
      });
    }

    // find posts by correct field name: hrId
    const posts = await InterveiwPost.find({
      hrId: new mongoose.Types.ObjectId(id),
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: posts.length > 0 ? 'Posts found.' : 'No posts found for this HR.',
      data: posts,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function getAllAttendeesByHr(req, res, next) {
  try {
    const { id } = req.params; // hr id
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'HR id is required.',
      });
    }

    // verify HR exists
    const hrExists = await Hr.findById(id);
    if (!hrExists) {
      return res.status(404).json({
        success: false,
        message: 'HR not found.',
      });
    }

    // optional pagination
    const page = Math.max(parseInt(String(req.query.page || '1'), 10), 1);
    const limit = Math.max(parseInt(String(req.query.limit || '20'), 10), 1);
    const skip = (page - 1) * limit;

    // find interview posts created by this HR
    const posts = await InterveiwPost.find({ hrId: new mongoose.Types.ObjectId(id) })
      .select('_id')
      .lean();
    const postIds = posts.map((p) => p._id);

    if (postIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No interview posts found for this HR.',
        data: [],
        meta: { page, limit, total: 0 },
      });
    }

    // find attendees whose interveiwPostId is in postIds
    // populate user info (exclude password) and interview post basic info
    const [attendees, total] = await Promise.all([
      DriveAttendies.find({ interveiwPostId: { $in: postIds } })
        .populate({ path: 'userId', select: '-password' })
        .populate({ path: 'interveiwPostId', select: 'title company hiringDriveStart hiringDriveEnd' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      DriveAttendies.countDocuments({ interveiwPostId: { $in: postIds } }),
    ]);

    return res.status(200).json({
      success: true,
      message: attendees.length > 0 ? 'Attendees found.' : 'No attendees found for this HR.',
      data: attendees,
      meta: { page, limit, total },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}
