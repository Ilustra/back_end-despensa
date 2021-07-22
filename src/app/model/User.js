const bcrypt = require('bcryptjs')

const mongoose = require('../../database');
const Conta = require('./Conta')
const SchemaTypes = mongoose.Schema.Types;

 const UserSchema = new mongoose.Schema({
  nome:{
    type: String,
  },
  provider:{
    type: String,
    require: true,
    default:'API-SERVICE' 
  },
  uid:{
    type: String,
    require: true,
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
      despensa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Despensa',
        require: true,
    },
    name: {
      type: String
    },
    isAdmin: {
      type: Boolean,
    }
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