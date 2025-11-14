import mongoose, { Schema } from 'mongoose';
const driveAttendiesSchema = new mongoose.Schema({
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
    resume: {
        type: String,
    },
}, { timestamps: true });
export const DriveAttendies = mongoose.model('DriveAttendies', driveAttendiesSchema);
//# sourceMappingURL=driveAttendiesModel.js.map