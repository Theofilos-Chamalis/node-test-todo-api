//Import express, body-parser and the ObjectID from native mongodb driver so we can use the isValid method of it
var express = require('express');
var bodyParser = require('body-parser');
var {
    ObjectID
} = require('mongodb');

//Import mongoose which is connected to mongo and our models
var {
    mongoose
} = require('./db/mongoose.js');
var {
    Todo
} = require('./models/todo');
var {
    User
} = require('./models/user');

//Create an express instance and set a port variable
var app = express();
const port = process.env.PORT || 3000;

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
        res.status(400).send(e.message);
    });
});

//Setup a route for get requests of all todos at /todos endpoint
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        //Send this as a property inside a JSON for more tweakability in the future
        res.send({
            todos
        });
    }, (e) => {
        //We could not send the error for security reasons
        res.status(400).send(e.message);
    });
});

//Setup a route for get requests of a single todo at /todos/id endpoint
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        //Using return to prevent further function execution
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if (todo === null) {
            return res.status(404).send();
        }
        res.send({
            todo
        });
    }).catch((er) => {
        res.status(400).send(er.message);
    });
});

//Setup a route for delete requests of a single todo at /todos/id endpoint
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (todo === null) {
            return res.status(404).send();
        }
        res.send({
            todo
        });
    }).catch((error) => {
        res.status(400).send(error.message);
    });
});

//Start our server
app.listen(port, () => {
    console.log(`Started listening on port ${port}`);
});