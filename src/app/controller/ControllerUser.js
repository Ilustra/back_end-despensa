const express = require('express')
const router = express.Router()
const User = require('../model/User')
const bcrypt = require('bcryptjs')

router.post('/modify_password/', async (req, res)=>{
  try {
    const {id, oldpassword, newpassword} = req.body
    let user = await User.findById(id).select('password')

    if (!await bcrypt.compareSync(oldpassword, user.password)){
      return res.status(400).send({error: 'Senha atual não confere'})

    }else{
      user.password = newpassword;

      console.log('-',user)
      await user.save();
      return res.send()
    }
  } catch (error) {
    console.log(error)
    return res.status(400).send(error)
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
    return res.send(user)
  } catch (error) {
    return res.status(400).send(error)
  }
})

module.exports = router;