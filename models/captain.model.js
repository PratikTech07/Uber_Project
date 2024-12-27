const mongoose = require('mongoose');
const { recompileSchema } = require('./user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const captainSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type :String,
            required :true,
            minlength :[3, 'First Name must be at least 3 character long']
        },
        lastname : {
            type :String,
            minlength :[3, 'Last Name must be at least 3 character long']
        }
    },
    email : {
        type :String,
        required :true,
        unique :true,
        match :[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email']
    },
    password : {
        type : String,
        required :true,
        select :false

    },
    socketId : {
        type :String
    },
    status : {
        type :String,
        enum :['active', 'inactive'],
        default :'active'
    },
    vehicle : {
       color :{
        type :String,
        required :true,
        minlength :[3, 'Color must be at least 3 character long']
       },
        plate : {
        type :String,
        required :true,
        minlength :[3, 'Plate Number must be at least 3 character long']
        },
        capacity : {
            type :Number,
            required :true,
            min :[1, 'Capacity must be at least 1']
        },
        type : {
            type :String,
            required :true,
            enum :['car', 'motorcycle', 'auto']
        }
    },
    location : {
        lat : {
            type :Number,
        },
        lng : {
            type :Number,
        }
    }

})

captainSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
};

captainSchema.methods.comparePassword = async function(password) {
    if (!this.password) {
        throw new Error('Password not found on this document. Ensure "select: false" is handled.');
    }
    return await bcrypt.compare(password, this.password);
};

captainSchema.methods.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
};




const captainModel = mongoose.model('captain', captainSchema  )

module.exports = captainModel;