const mongoose = require('../../database')

const SchemaBallance = new mongoose.Schema({
  itens:{
    type: Number,
    require: true, 
  },
  totalNotas:{
    type: Number,
    require: true, 
  },
  total:{
    type: Number,
    require: true,
  },

 /*
 lojas:[
  {
    cnpj:{
      type: String,
      unique: true,
    },
    nome:{
      type: String,
      default: false
    },
    itens:{
        type: Number,
        default: false
    },  
    total:{
      type: Number,
    },
  }
  ],
*/
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedTo:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  createdAt:{
    type: Date,
    default: Date.now
  },
})

const Ballance = mongoose.model('Ballance', SchemaBallance);

module.exports = Ballance;