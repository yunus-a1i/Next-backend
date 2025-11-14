import User from '../models/userModal.js';
export async function createUser(req, res, next) {
    try {
        const { name, email, password } = req.body;
        if (!(name && email && password)) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.',
            });
        }
        // check for existing User
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists.',
            });
        }
        // create new user
        let user = new User({ name: name, email: email, password: password });
        user = await user.save();
        // remove password from the user
        const { password: _, ...userWithoutPassword } = user.toObject();
        return res.status(201).json({
            success: true,
            message: 'User is created successfully.',
            data: userWithoutPassword,
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
export async function updateUser(req, res, next) {
    try {
        const { id } = req.params;
        const { name, contact, resumeLink, projects, domain, skills, experience, education, bio, profilePhotoLink } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Id is required.',
            });
        }
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }
        const updates = {};
        if (name)
            updates.name = name;
        if (contact)
            updates.contact = contact;
        if (resumeLink)
            updates.resumeLink = resumeLink;
        if (projects)
            updates.projects = projects;
        if (domain)
            updates.domain = domain;
        if (skills)
            updates.skills = skills;
        if (experience)
            updates.experience = experience;
        if (education)
            updates.education = education;
        if (bio)
            updates.bio = bio;
        if (profilePhotoLink)
            updates.profilePhotoLink = profilePhotoLink;
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields provided to update.',
            });
        }
        const updatedUser = await User.findByIdAndUpdate(id, { $set: updates }, { new: true }).select('-password');
        return res.status(200).json({
            success: true,
            message: 'User updated successfully.',
            data: updatedUser,
        });
    }
    catch (error) {
        console.error('UpdateUser Error:', error);
        next(error);
    }
}
export async function getUser(req, res, next) {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Id is required.',
            });
        }
        const user = await User.findById({ _id: id });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
                data: user,
            });
        }
        return res.status(200).json({
            success: true,
            message: 'User found.',
            data: user,
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
export async function deleteUser(req, res, next) {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'UserId is required.',
            });
        }
        const existingUser = await User.findOne({ _id: id });
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User not found.',
            });
        }
        const deletedUser = await User.deleteOne({ _id: id });
        return res.status(200).json({
            success: true,
            message: 'User is deleted succesdfully.',
            data: deletedUser,
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
export async function getAllUser(req, res, next) {
    try {
        const user = await User.find();
        return res.status(200).json({
            success: true,
            message: 'User found.',
            data: user,
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
//# sourceMappingURL=userController.js.map