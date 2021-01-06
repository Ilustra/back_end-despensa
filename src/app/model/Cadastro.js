
const mongoose = require('../../database')
const SchemaTypes = mongoose.Schema.Types;

const CadastroSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
        unique: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    firstName: {
        type: String,
        require: true,
    },     
    lastName: {
        type: String,
        require: true,
    },
    ddd: {
        type: String,
        require: true,
    }, 
    phone: {
        type: String,
        require: true,
    },   
    cep: {
        type: String,
        require: true,
    },      
    localidade: {
        type: String,
        require: true,
    },       
    bairro: {
        type: String,
        require: true,
    },      
    uf: {
        type: String,
        require: true,
    },   
    createdAt: {
        type: Date,
        default: Date.now
    },
})




const Cadastro = mongoose.model('Cadastro', CadastroSchema);

module.exports = Cadastro;