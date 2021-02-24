const bcrypt = require('bcryptjs')

const mongoose = require('../../database')
const SchemaTypes = mongoose.Schema.Types;

 const UserSchema = new mongoose.Schema({
  nome:{
    type: String,
    require: true, 
  },
  first_name:{
    type: String, 
  },
  last_name:{
    type: String,
  },
  provider:{
    type: String,
    require: true,
    default:'API-SERVICE' 
  },
  email:{
    type: String,
    require: true,
    unique: true,
  },    
  password:{
    type: String,
    require: true, 
    select: false,
  },
  despensa:[
    {
    id:{
      type: mongoose.Schema.Types.ObjectId,
      ref:'Despensa'
    },
    padrao:{
      type: Boolean,
      default: false
    },  
    updatedAt:{
      type: Date,
    },
    }
  ],
  createdAt:{
    type: Date,
    default: Date.now
  },
  notas:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'NotaNfe',
    require: true
  }]
})

UserSchema.pre('save', async function(next){
  const has = await bcrypt.hash(this.password, 10);
  this.password = has
  next();
})

const User = mongoose.model('User', UserSchema);

module.exports = User;