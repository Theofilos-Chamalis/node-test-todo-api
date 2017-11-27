const {
    SHA256
} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

//This adds a salt to the password 
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

var hashedPassword = '$2a$10$wMNd1S9J7EzWRbBvnvgg7OIiXp7w214ZdKmeG24DZNIQ4uT99kN36';
bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});

// var data = {
//     id: 10
// };

// var token = jwt.sign(data,'mysecret');
// console.log(token);

// var decoded = jwt.decode(token, 'mysecret');
// console.log('decoded: ',decoded);

// var message = 'I am a nigga';
// var hash = SHA256(message).toString();

// console.log('Message =', message, 'and its hash =', hash);

// var data = {
//     id: 4 //the id of a user

// };

// var token = { //This is sent back to the user
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString() //The hashed value of the data
// };

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if (resultHash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed. Do not trust them');
// }