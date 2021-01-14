const mongoose = require('../../database')

const SchemaBallance = new mongoose.Schema({
  year:{
    type: Number,
    require: true,
    unique: true,
    index: true,
   
  },
  months:[
    {
      month:{
        type: Number
      },
      pg_dinheiro:{
        type: Number,
      },
      pg_credito:{
        type: Number,
      },
      pg_debito:{
        type: Number
      },
      pg_alimentacao:{
        type: Number
      },
      descriptions:
        {
          itens: {
            type: Number,
          },
          qtdNotas:{
            type: Number
          },
          total: {
            type: Number
          },
          tributos:{
            type: Number
          }
        }
    }
  ],
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