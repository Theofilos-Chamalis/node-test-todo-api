//Import the ObjectID variable from mongodb native driver to use the isValid() method
const {ObjectID} = require('mongodb');
//Import mongoose connection to mongo
const {mongoose} = require('./../server/db/mongoose');
//Import the Todo and User models
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//ID from the todo collection in Mongo
var id = '5a10895c94659856e774c5fa';
var id2 = '5a109ded3615e57360e43b27';

//Validate a given id for mongo
if (!ObjectID.isValid(id)) {
    console.log('ID is not valid');
}

//Find all occurences of Todos 
Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos', todos);
});

//Find the first occurence of a Todo 
Todo.findOne({
    _id: id
}).then((todo) => {
    if (!todo) {
        return console.log('ID not found!');
    }
    console.log('Todo', todo);
});

//Find the first occurence of a Todo by its id
Todo.findById(id).then((todoById) => {
    if (!todoById) {
        return console.log('ID not found!');
    }
    console.log('TodoById', todoById);
}).catch((e) => {
    console.log(e);
});

//Find the first occurence of a User by its id
User.findById(id2).then((user) => {
    if (!user) {
        return console.log('There is no user with the id:', id2);
    }
    console.log('User:', JSON.stringify(user, undefined, 2));
}).catch((er) => {
    console.log('Error:', er.message);
});