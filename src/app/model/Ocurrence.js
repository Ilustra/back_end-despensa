
const mongoose = require('../../database')
const SchemaTypes = mongoose.Schema.Types;

const OcurrencesSchema = new mongoose.Schema({

    title: {
        type: String,
        require: true,
    },     
    description: {
        type: String,
        require: true,
    },
    note: {
        type: String,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
      },
      assignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
      },  
    createdAt: {
        type: Date,
        default: Date.now
    },
})




const Ocurrence = mongoose.model('Ocurrence', OcurrencesSchema);

module.exports = Ocurrence;