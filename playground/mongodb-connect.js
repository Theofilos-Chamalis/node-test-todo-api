//Standard importing of MongoClient
// const MongoClient = require('mongodb').MongoClient;

//Connect to Mongo using ES6 Object destructuring to get also ObjectID for new IDs creation
const {
    MongoClient,
    ObjectID
} = require('mongodb');

//Connect to the TodoApp database inside Mongo (the URL is its location)
MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to mongodb server');

    //ES6 Object destructuring
    // var user = {name:'giannis',height: 6.4};
    // var {height} = user;

    //Insert one document in the Todos Collection
    db.collection('Todos').insertOne({
        text: 'Something to do',
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert todo : ', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    //Insert one document in the Users Collection and get its creation time printed
    db.collection('Users').insertOne({
        name: 'Nick',
        age: 23,
        location: 'Thessaloniki'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert user : ', err);
        }
        console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    });

    //Close the db
    db.close();
});