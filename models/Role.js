const {Schema, model } = require ('mongoose');

const Role = new Schema({
    value: {type: String, unique: true, default: "USER"},
    
})

            // 1. Model name, 2. Schema
module.exports = model('Role', Role)