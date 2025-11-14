import mongoose from 'mongoose';
const domainSchema = new mongoose.Schema({
    domainName: {
        type: String,
        required: true,
    },
}, { timestamps: true });
export const Domain = mongoose.model('Domain', domainSchema);
//# sourceMappingURL=domainModel.js.map