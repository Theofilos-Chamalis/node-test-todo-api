//Standard importing of MongoClient
// const MongoClient = require('mongodb').MongoClient;

//Connect to Mongo using ES6 Object destructuring to get also ObjectID for new IDs creation
const {MongoClient, ObjectID} = require('mongodb');

//Connect to mongoDB in the TodoApp database
MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to mongodb server');

    //Find the Todos that are not completed and print their number
    db.collection('Todos').find({completed: false}).count().then((count)=>{
        console.log('The count is: ',count);
    },(err)=>{
        console.log('Unable to fetch the documents in todos', err);
    });
    
    //Find the todos with a specific ObjectID a.k.a _id and pretty print them
    db.collection('Todos').find({_id: new ObjectID('5a0f594b023030b40ae28334')}).toArray().then((docs)=>{
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    },(err)=>{
        console.log('Unable to fetch the documents in todos', err);
    });
    
    //Insert one document into the Users collection
    db.collection('Users').insertOne({name: 'Theofilos', age: 63, location: 'Trikala'}).then((res)=>{
        console.log('Insert was successful with code: ', res);
    });

    //Find the Users with the name property of Theofilos and print their number
    db.collection('Users').find({name: 'Theofilos'}).count().then((res)=>{
        console.log('The count is: ', res);
    });

    //Close the db
    // db.close();
});