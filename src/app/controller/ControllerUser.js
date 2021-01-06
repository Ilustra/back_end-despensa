const express = require('express')
const router = express.Router()
const User = require('../model/User')



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
/*
router.get('/consulta/user/:email',  async (req, res)=>{
  const {email} = req.params
try{
  const user = await User.findOne({email: email});
  if(!user)
    return res.status(400).send({error:'Usuário não encontrado'})

  user.despensa = undefined
  user.cpf = undefined
  user.telefone = undefined
  user.email = undefined
  user.ddd = undefined
    return res.send(user)
}catch(e){
  res.status(400).send({error:'Falha ao atualizar'})
}
})
*/
module.exports = router;