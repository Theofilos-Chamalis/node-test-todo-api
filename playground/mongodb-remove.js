// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to mongodb server');

    //deleteMany deletes all the documents that meet the criteria
    db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((res)=>{
        console.log(res);
    });

    //deleteOne deletes the first document that meets the criteria
    db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((res)=>{
        console.log(res);
    });

    //findOneAndDelete deletes the first document that meets the criteria and then returns it as well
    db.collection('Todos').findOneAndDelete({completed: false}).then((res)=>{
        console.log(res);
    });

    // db.close();
});