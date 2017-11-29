//Import the configuration file
require('./config/config.js');

//Import express, body-parser and the ObjectID from native mongodb driver so we can use the isValid method of it
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {
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
var {
    authenticate
} = require('./middleware/authenticate');

//Create an express instance and set a port variable
var app = express();
const port = process.env.PORT;

//Get the body of a request as a json using body-parser
app.use(bodyParser.json());

//Setup a route for post requests at /todos endpoint
app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e.message);
    });
});

//Setup a route for post requests at /users endpoint
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((er) => {
        res.status(400).send(er.message);
    });
});

//Setup a private route for get requests at /users/me endpoint
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

//Setup a post route at /users/login with email and password
app.post('/users/login', (req, res) => {
    var password = req.body.password;
    var email = req.body.email;

    //We get the user back from the mongoose model function
    //and we create a new token for it
    User.findByCredentials(email, password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

//Setup a route for get requests of all todos at /todos endpoint
app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
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
app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        //Using return to prevent further function execution
        return res.status(404).send();
    }

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
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
app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
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

//Setup a route for patch requests of a single todo at /todos/id endpoint
app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    //If we update the todo to be completed, write the timestamp
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    //The actual update query to MongoDB where we set the properties of body to update the document with the chosen id
    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {
        $set: body
    }, {
        new: true
    }).then((todo) => {
        if (todo === null) {
            return res.status(404).send();
        }

        res.send({
            todo
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

//Delete a token from a user, i.e. log him out
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

//Start our server
app.listen(port, () => {
    console.log(`Started listening on port ${port}`);
});