const {
    SHA256
} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10
};

var token = jwt.sign(data,'mysecret');
console.log(token);

var decoded = jwt.decode(token, 'mysecret');
console.log('decoded: ',decoded);

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