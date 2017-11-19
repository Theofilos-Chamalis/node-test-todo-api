//Import mongoose
var mongoose = require('mongoose');

//Use the built in global promise library for mongoose instead of a 3rd party one
mongoose.Promise = global.Promise;
//Mongoose connection to the mongo database with promise error handling
mongoose.connect('mongodb://localhost:27017/TodoApp', {
    useMongoClient: true
}).catch((e) => {
    console.log(JSON.stringify(e, undefined, 2));
});

module.exports = {
    mongoose
};