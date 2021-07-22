const mongoose = require('../../database')

const SchemaOperation = new mongoose.Schema({
    descricao: {
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
    pagamento:[
        {
          dinheiro:{
            type: Number, 
          },   
           cartaoDebito:{
            type: Number, 
          },
          cartaoCredito:{
            type: Number, 
          },    
          outros:{
            type: Number, 
          },
        }  
        ],
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
    anexo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NotaNfe',
    },      
    tipo: {
        type: String,
        require: true,
    },  
    description: {
        type: String,
        require: true,
    },      
    valor: {
        type: Number,
        require: true,
    },     
    categoria: {
        type: String,
        require: true,
    },       
    date: {
        type: String,
        require: true,
    },   

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
    },
})

const Operation = mongoose.model('Operation', SchemaOperation);

module.exports = Operation;
