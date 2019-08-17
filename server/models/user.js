const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
//to access the document that we want the function to run on i.e
//the specific instance
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, process.env.JWT_SECRET).toString();

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

//Remove the token from a user in order to log him out
//The $pull operator removes data based on criteria
UserSchema.methods.removeToken = function (token) {
    var user = this;

    return user.update({
        $pull: {
            tokens: {
                token: token
            }
        }
    });
};

//This turns to a model method and not an instance method.
//The keyword 'this' refers to the model here
UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        //This promise will be returned by findByToken
        return Promise.reject();
    }

    //The first quotes are used to access a nested property
    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

//Model method to search for a user by its credentials
UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;

    return User.findOne({
        email
    }).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });

    });
};

//Mongoose middleware. This lets us run some code before saving
//it to mongoDB, i.e. hashing the password that is going to be saved 
UserSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        var password = user.password;

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

//Create the User Collection model and use a custom npm module validator for email validation
var User = mongoose.model('User', UserSchema);

module.exports = {
    User
};