const mongoose = require('../../database')
const Ballance = require('./Ballance');

const SchemaTypes = mongoose.Schema.Types;

const NotaSchema = new mongoose.Schema({
  nome:{
    type: String,
    require: true
    //lowercase: true,
  }, 
  cnpj:{
    type: String, 
    require: true,
  },
  rua:{
    type: String, 
    require: true,
  },
  numero:{
    type: String, 
    require: true,
  },
  localidade:{
    type: String, 
    require: true,
  },
  uf:{
    type: String, 
    require: true,
  },
  bairro:{
    type: String, 
    require: true,
  },
  itens:{
    type: Number, 
    require: true,
  },
  pagamento:{
    type: String, 
    require: true,
  },
  total:{
    type: Number, 
    require: true,
  },
  emissao:{
    type: String,
    require: true,
  },
  produtos:[
    {
      codigo:{
        type: Number, 
        require: true
      },
      nome:{    
        type: String, 
        require: true
      },
      quantidade:{    
        type: Number, 
        require: true
      },
      UN:{    
        type: String, 
        require: true
      },
      valor:{    
        type: Number, 
        require: true
      },
      total:{    
        type: Number, 
        require: true
      },
      emissao:{    
        type: String, 
        require: true
      },
      empresa:{    
        type: String, 
        require: true
      },
    }
  ],
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
  url:{
    type: String,
    require: true,
  },
  createdAt:{
    type: Date,
    default: Date.now
  },
})
NotaSchema.post('save', async function(doc){
  const ballance = await Ballance.findOne({user: doc.user})
  await ballance.update({
    itens: ballance.itens + doc.itens,
    totalNotas: ballance.totalNotas + 1,
    total: ballance.total + doc.total
  })
  /*await Ballance.updateOne({user: doc.user},{
    itens: ballance.itens + doc.itens,
    totalNotas: ballance.totalNotas + 1,
    total: ballance.total + doc.total
  });*/
})
const NotaNfe = mongoose.model('NotaNfe', NotaSchema);
module.exports = NotaNfe;