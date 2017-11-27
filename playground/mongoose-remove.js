//Import the ObjectID variable from mongodb native driver to use the isValid() method
const {
    ObjectID
} = require('mongodb');
//Import mongoose connection to mongo
const {
    mongoose
} = require('./../server/db/mongoose');
//Import the Todo and User models
const {
    Todo
} = require('./../server/models/todo');
const {
    User
} = require('./../server/models/user');

//Remove a document by ID. There are remove and findOneAndRemove methods as well
Todo.findByIdAndRemove('5a11727702b76553271eb7b6').then((doc) => {
    console.log(doc);
});