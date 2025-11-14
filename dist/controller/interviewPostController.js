import { InterveiwPost } from '../models/interveiwPostModel.js';
export async function createPost(req, res, next) {
    try {
        const { hrId, jobTitle, company, description, qualification, experienceRequired, hiringDriveStart, hiringDriveEnd, location, address, email, phone, salary, openVacancies, driveStatus, domainId, } = req.body;
        // ✅ Check for missing required fields (including company)
        if (!(hrId &&
            jobTitle &&
            company &&
            description &&
            qualification &&
            experienceRequired &&
            hiringDriveStart &&
            hiringDriveEnd &&
            location &&
            address &&
            email &&
            phone &&
            salary &&
            openVacancies &&
            driveStatus)) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.',
            });
        }
        // ✅ Create the post (include company and domainId)
        let post = new InterveiwPost({
            hrId,
            domainId,
            jobTitle,
            company,
            description,
            qualification,
            experienceRequired,
            hiringDriveStart,
            hiringDriveEnd,
            location,
            address,
            email,
            phone,
            salary,
            openVacancies,
            driveStatus,
        });
        post = await post.save();
        return res.status(201).json({
            success: true,
            message: 'Post created successfully.',
            data: post,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function updatePost(req, res, next) {
    const { hrId, domainId, jobTitle, description, qualification, experienceRequired, hiringDriveStart, hiringDriveEnd, location, address, email, phone, salary, openVacancies, driveStatus, } = req.body;
    const { id } = req.params;
    if (!(id &&
        hrId &&
        domainId &&
        jobTitle &&
        description &&
        qualification &&
        experienceRequired &&
        hiringDriveStart &&
        hiringDriveEnd &&
        location &&
        address &&
        email &&
        phone &&
        salary &&
        openVacancies &&
        driveStatus)) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required.',
        });
    }
    let post = await InterveiwPost.findByIdAndUpdate({
        _id: id,
    }, {
        domainId: domainId,
        jobTitle: jobTitle,
        description: description,
        qualification: qualification,
        experienceRequired: experienceRequired,
        hiringDriveStart: hiringDriveStart,
        hiringDriveEnd: hiringDriveEnd,
        location: location,
        address: address,
        email: email,
        phone: phone,
        salary: salary,
        openVacancies: openVacancies,
        driveStatus: driveStatus,
    }, { new: true });
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
}
export async function getPosts(req, res, next) {
    try {
        const { id } = req.params;
        console.log(id);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'HrId is required.',
            });
        }
        const posts = await InterveiwPost.find({ hrId: id });
        return res.status(200).json({
            success: true,
            message: 'All post is fectched successfully.',
            data: posts ?? [],
        });
    }
    catch (error) {
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
                message: 'All feilds are required.',
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
            message: 'Post is deleted successfully.',
            data: post,
        });
    }
    catch (error) {
        next(error);
    }
}
// export async function getAllPosts(req: Request, res: Response, next: NextFunction) {
//   try {
//     const posts = await InterveiwPost.find();
//     return res.status(200).json({
//       success: true,
//       message: 'All post is fectched successfully.',
//       data: posts ?? [],
//     });
//   } catch (error) {
//     next(error);
//   }
// }
export async function getAllPosts(req, res, next) {
    try {
        // Parse query params with defaults
        const limit = parseInt(req.query.limit) || 4; // number of posts per request
        const page = parseInt(req.query.page) || 1; // current page (1-based)
        // Calculate skip count
        const skip = (page - 1) * limit;
        // Fetch paginated posts
        const posts = await InterveiwPost.find()
            .sort({ createdAt: -1 }) // newest first (optional)
            .skip(skip)
            .limit(limit);
        // Get total count for frontend
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
    }
    catch (error) {
        next(error);
    }
}
export async function getAllPostsFull(req, res, next) {
    try {
        const posts = await InterveiwPost.find()
            .sort({ createdAt: -1 }); // newest first (optional)
        return res.status(200).json({
            success: true,
            message: 'All posts fetched successfully.',
            data: posts,
            total: posts.length,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=interviewPostController.js.map