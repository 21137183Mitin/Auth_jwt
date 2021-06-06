const { Schema, model } = require ('mongoose');

//create constructor Schema describe how the user is stored in the database
const User = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    roles: [{type: String, ref: 'Role' }]
});

            // 1. Model name, 2. Schema
module.exports = model('User', User)