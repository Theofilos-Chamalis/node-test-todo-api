// const MongoClient = require('mongodb').MongoClient;
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

    //Update an existing document with a given _id and return the resulting one from the promise
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5a103b6e62823d925116bdc4')
    }, {
        $set: {
            name: 'Theo'
        },
        $inc: {
            age: +4
        }
    }, {
        returnOriginal: false
    }).then((res) => {
        console.log(JSON.stringify(res, undefined, 2));
    });

    // db.close();
});