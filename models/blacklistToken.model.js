const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 24 * 60 * 60 // Token documents will be automatically deleted after 24 hours
    }
});

module.exports = mongoose.model('BlacklistToken', blacklistTokenSchema);