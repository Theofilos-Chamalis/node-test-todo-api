// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to mongodb server');

    // db.collection('Todos').find({completed: false}).count().then((count)=>{
    //     console.log('The count is: ',count);
    // },(err)=>{
    //     console.log('Unable to fetch the documents in todos', err);
    // });
    
    // db.collection('Todos').find({_id: new ObjectID('5a0f594b023030b40ae28334')}).toArray().then((docs)=>{
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // },(err)=>{
    //     console.log('Unable to fetch the documents in todos', err);
    // });
    
    // db.collection('Users').insertOne({name: 'Theofilos', age: 63, location: 'Trikala'}).then((res)=>{
    //     console.log('Insert was successful with code: ', res);
    // });

    db.collection('Users').find({name: 'Theofilos'}).count().then((res)=>{
        console.log('The count is: ', res);
    });

    // db.close();
});