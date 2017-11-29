//Import mongoose
var mongoose = require('mongoose');

//Use the built in global promise library for mongoose instead of a 3rd party one
mongoose.Promise = global.Promise;
//Mongoose connection to the mongo database (local or heroku one) with promise error handling
mongoose.connect(process.env.MONGODB_URI, {
    useMongoClient: true
}).catch((e) => {
    console.log(JSON.stringify(e, undefined, 2));
});

module.exports = {
    mongoose
};