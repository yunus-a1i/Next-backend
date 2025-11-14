import type { NextFunction, Request, Response } from 'express';
import Hr from '../models/hrModel.ts';
import { InterveiwPost } from '../models/interveiwPostModel.ts';
import mongoose from 'mongoose';
import { DriveAttendies } from '../models/driveAttendiesModel.ts';

export async function createHr(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const { name, email, password, contact } = req.body;
    if (!(name && email && password && contact)) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }
    // check for existing Hr
    const existingHr = await Hr.findOne({ email: email });
    if (existingHr) {
      return res.status(409).json({
        success: false,
        message: 'Hr already exists.',
      });
    }

    // create new Hr
    let hr = new Hr({ name: name, email: email, password: password, contact: contact });
    hr = await hr.save();
    // remove password from the user
    const { password: _, ...userWithoutPassword } = hr.toObject();  

    return res.status(201).json({
      success: true,
      message: 'Hr is created successfully.',
      data: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function updateHr(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const { name, location, contact, company, city, state, country } = req.body;
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
    const updatedHr = await Hr.findByIdAndUpdate(
      { _id: id },
      {
        name: name,
        contact: contact,
        location: location,
        company: company,
        city: city,
        state: state,
        country: country,
      },
      { new: true },
    ).select('-password');

    return res.status(200).json({
      success: true,
      message: 'Hr updated successfully.',
      data: updatedHr,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function getHr(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Id is required.',
      });
    }

    const hr = await Hr.findById({ _id: id }).select('-password');
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
    console.log(error);
    next(error);
  }
}

export async function deleteHr(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'UserId is required.',
      });
    }

    const existingHr = await Hr.findOne({ _id: id });
    if (!existingHr) {
      return res.status(400).json({
        success: false,
        message: 'Hr not found.',
      });
    }

    const deletedHr = await Hr.deleteOne({ _id: id });
    return res.status(200).json({
      success: true,
      message: 'Hr is deleted succesdfully.',
      data: deletedHr,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function getAllHr(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const hr = await Hr.find();
    return res.status(200).json({
      success: true,
      message: 'Hr found.',
      data: hr,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function getAllPostsByHr(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
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


export async function getAllAttendeesByHr(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
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
    const posts = await InterveiwPost.find({ hrId: new mongoose.Types.ObjectId(id) }).select('_id').lean();
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
        .populate({ path: 'interveiwPostId', select: 'jobTitle company hiringDriveStart hiringDriveEnd' })
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
