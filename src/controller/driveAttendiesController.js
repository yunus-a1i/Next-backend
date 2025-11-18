// src/controller/driveAttendiesController.js
import DriveAttendies from '../models/driveAttendiesModel.js';
import InterveiwPost from '../models/interveiwPostModel.js';

export async function createDriveAttendies(req, res, next) {
  try {
    const { userId, interveiwPostId, resumeLink } = req.body;

    if (!(userId && interveiwPostId)) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    // Check if already attending
    const existing = await DriveAttendies.findOne({ userId, interveiwPostId });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'You are already attending this drive.',
        data: existing,
      });
    }

    // Create new attendee
    let driveData = new DriveAttendies({
      userId,
      interveiwPostId,
      // model field was `resume` — store the incoming resumeLink into it
      resume: resumeLink,
    });

    driveData = await driveData.save();

    // Increment applied user count on the interview post
    const interveiwPost = await InterveiwPost.findByIdAndUpdate(interveiwPostId, { $inc: { applicants: 1 } }, { new: true });

    return res.status(201).json({
      success: true,
      message: 'You are registered for this drive.',
      data: driveData,
      interveiwPostData: interveiwPost,
    });
  } catch (error) {
    next(error);
  }
}
