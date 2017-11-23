const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

//usePushEach option is used at the end, since .push
//does not work normally for this version of mongoose
//We used the Schema and not directly creating a model
//because we want to create some functions on it
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        required: true,
        trim: true,
        type: String,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
}, {
    usePushEach: true
});

//This is going to be used for our instance methods of users
//Here we need a traditional function because we will use 'this'
//to access the document that we want the function to run on
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, 'secret').toString();

    user.tokens.push({
        access,
        token
    });
    return user.save().then(() => {
        return token;
    });
};

//We want to override the inbuilt mongoose toJSON method so
//that we do not send back to the user unecessary data
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
};

//Create the User Collection model and use a custom npm module validator for email validation
var User = mongoose.model('User', UserSchema);

module.exports = {
    User
};