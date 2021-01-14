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
  pagamento:[
  {
    dinheiro:{
      type: Number, 
      require: true
    },   
     cartaoDebito:{
      type: Number, 
      require: true
    },
    cartaoCredito:{
      type: Number, 
      require: true
    },
  }  
  ],
  total:{
    type: Number, 
    require: true,
  },
  tributos:{
    type: Number, 
    require: true,
  },  
  descontos:{
    type: Number, 
    require: true,
  },
  subTotal:{
    type: Number, 
    require: true,
  },
  emissao:{
    type: Date,
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
        type: Date,
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
  const now = new Date()
  const ballance = await Ballance.findOne({$and: [{user: doc.user}, {year: now.getFullYear()}]})
  if(!ballance){
    try {
       await Ballance.create({user: doc.user, year: now.getFullYear(), months: [{month: now.getMonth(), descriptions: {itens: doc.itens, qtdNotas: 1, total: doc.total, tributos: doc.tributos}}]})
    } catch (error) {

    }
  } else{
    const updateMonths = ballance.months.filter(element=>{
      if(element.month == now.getMonth())
      return element;
    })
    if(!updateMonths.length){
      await ballance.months.push({
        month: now.getMonth(),
        descriptions: {
          itens: doc.itens,
          qtdNotas: 1,
          total: doc.total,
          tributos: doc.tributos
        }
      })
      await ballance.save()
    }else{
      await ballance.update({months:[{
        month: updateMonths[0].month,
        descriptions: {
          itens: doc.itens + updateMonths[0].descriptions.itens,
          qtdNotas: 1 + updateMonths[0].descriptions.qtdNotas,
          total: doc.total + updateMonths[0].descriptions.total,
          tributos: doc.tributos + updateMonths[0].descriptions.tributos
        }
      }]})
    }
  }

  

})
const NotaNfe = mongoose.model('NotaNfe', NotaSchema);
module.exports = NotaNfe;