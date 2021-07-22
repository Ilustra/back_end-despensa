const mongoose = require('../../database')

const SchemaConta = new mongoose.Schema({
    description: {
        type: String,
        require: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    user_shareds: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                require: true,
            },            
            name: {
                type: String,
                require: true,
            },       
            photoURL: {
                type: String,
                require: true,
            }
        }
    ],   
    tipo: {
        type: String,
        require: true,
    },  
    saldo: {
        type: Number,
        require: true,
    },     
    extrato:[
        {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Operation',
                require: true,
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
    },
})

const Conta = mongoose.model('Conta', SchemaConta);

module.exports = Conta;
