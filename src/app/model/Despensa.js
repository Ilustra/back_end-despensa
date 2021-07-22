const mongoose = require('../../database')

const SchemaDespensa = new mongoose.Schema({
    name: {
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
            despensa: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Despensa',
                require: true,
            },
            name: {
                type: String,
                require: true,
            },
            photoURL: {
                type: String,
            }
        }
    ],
    items: [
        {
            //se o produto foi aberto ou não
            status: {
                type: Boolean,
                default: false
            },
            openDate: { type: Date},
            //enum NIVEL [{1, BAIXO}, {2, MEDIO}, {3, ALTO}]
            nivel: { type: Number},
            //quem consumiu
            user: { type: String },
            //data que foi atualizado e por quem
            updatedAt: { type: Date },
            name: { type: String},
            UN: { type: String },
            quantidade: { type: Number },
            valor: { type: Number },
            total: { type: Number },
            //data do vencimento do produto
            validade: { type: Date },
            updateUser: { type: String },
            createdAt: { type: Date },
            //enum [cereal, carnes, bebidas, doces, panificadora]
            categoria: { type: String },
            local: {type: String}
        }
    ],
    userUpdate: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
    },
})

const Despensa = mongoose.model('Despensa', SchemaDespensa);

module.exports = Despensa;
