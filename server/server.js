//Import express and body-parser
var express = require('express');
var bodyParser = require('body-parser');

//Import mongoose which is connected to mongo and our models
var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

// Create an express instance and set a port variable
var app = express();
var port = process.env.PORT || 3000;

//Get the body of a request as a json using body-parser
app.use(bodyParser.json());

//Setup a route for post requests at /todos endpoint
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });

});

//Start our server
app.listen(port, () => {
    console.log(`Started listening on port ${port}`);
});