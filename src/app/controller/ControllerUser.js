const express = require('express')
const router = express.Router()
const User = require('../model/User')
const Conta = require('../model/Conta')
const bcrypt = require('bcryptjs')


router.post('/register', async (req, res)=>{
  try {
    console.log(req.body)
    const {email} = req.body

    const user = await User.findOne({email})

    if(user){
      user.password = undefined
      let count = await Conta.findOne({user: user._id})
      if(!count)
        await Conta.create({user: user._id, description: '', saldo: 0, tipo: 'PRINCIPAL'})
      return res.send(user);
    }

    const new_user = await User.create(req.body)
    new_user.password = undefined

    let new_count = await Conta.findOne({user: new_user._id})
    if(!new_count)
      await Conta.create({user: new_user._id, description: '', saldo: 0, tipo: 'PRINCIPAL'})

    return res.send(new_user);
    
  } catch (error) {
    console.log('catc',error)
   return res.status(400).send({error: 'Falha ao registrar'}) 
  }
})
router.put('/', async (req, res) => {
  try {
    const { nome, email, DDD, telefone, cep } = req.body
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).send({ error: 'Usuário não encontrado' })
    const updateUser = {
      nome,
      DDD,
      telefone,
      cep
    }
    await user.updateOne(updateUser)

    return res.send(updateUser)
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})
router.get('/:email', async (req, res)=>{
  try {
    const { email } = req.params
    const user = await User.findOne({ email });
    if(!user)
      return res.status(400).send({error: 'Usuário não encontrado'})

    console.log(user)
    return res.send(user)
  } catch (error) {
    return res.status(400).send(error)
  }
})

module.exports = router;