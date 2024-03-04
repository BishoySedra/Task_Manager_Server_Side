const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name must be provided'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email must be provided'],
        unique: true,
        validate: [validator.isEmail, 'Please type email in valid format'],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'password must be provided'],
        min: [8, 'password minimum is 8 characters'],
        select: false
    },
    password_confirm: {
        type: String,
        required: [true, 'password confirm must be provided'],
        validate:  {
            validator: function (confirm) { return this.password === this.password_confirm }
         , message:'password confirm should be the same as password'},
        select: false
    },
    password_changed_at: Date,
    created_at: {
        type: Date,
        default: Date.now(),
        select:false
    },
    active: {
        type: Boolean,
        default: true
    },
    Friends: [{
        friend_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        request_approval: Boolean
    }],
    Tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Task'
    }],
    Categories: [{
         type: String , default: ['Sports', 'Education', 'Work']
}],
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.password_confirm = undefined;
    next();
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    
    this.passwordChangedAt = Date.now() - 1000;
    next();
});


userSchema.methods.passwordComparison = async function (loginPassword, savedPassword) {
    return await bcrypt.compare(loginPassword, savedPassword);
};

userSchema.methods.changePasswordAuthentication = function (tokenIssuedAt) {
    if(this.passwordChangedAt)
    {
        const changeTime = parseInt(this.passwordChangedAt.getTime() / 1000,10);
        console.log(changeTime);
        return changeTime > tokenIssuedAt;
    }
    return false;    
};


const User = mongoose.model('User', userSchema);

module.exports = User;