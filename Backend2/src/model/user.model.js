const { Schema, model }  = require('mongoose');
const bcrypt = require('bcrypt');
const mongoose  = require('mongoose');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default : 'user' //Add, SimpleUser (Can only comment) and Annoucer (or administrator that can post annoucement) 
    },
    appliedPost:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'CasPost',
    },
    club:{
        type:[mongoose.Schema.Types.ObjectId],
        ref: 'Club',
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

UserSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

// Hash a password before saving to db
UserSchema.pre('save', async function (next) {
    const user = this;
    if(!user.isModified('password')) return next();
    const hashedPassword = await  bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
})

// compare password when user logins
UserSchema.methods.comparePassword = function (givenPassword) {
    return bcrypt.compare(givenPassword, this.password);
}

const  User = model('User', UserSchema);

module.exports  = User;
