const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'Fisrt Name must be at least 3 character long ']
        },
        lastname: {
            type: String,
            minlength: [3, 'Last Name must be at least 3 character long ']
        },
    },
    email: {
        type :String,
        required :true,
        unique : true,
        minlength: [5, 'Email Name must be at least 5 character long ']

    },
    password : {
        type :String,
        required :true,
        unique : true,
        select :false,
    },
    socketId : {
        type : String   
    }

})

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Optional: Set token expiration
    });
    return token;
};

// Compare plaintext password with hashed password
userSchema.methods.comparePassword = async function(password) {
    if (!this.password) {
        throw new Error('Password not found on this document. Ensure "select: false" is handled.');
    }
    return await bcrypt.compare(password, this.password);
};

// Hash password
userSchema.methods.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model('user', userSchema)

module.exports = userModel