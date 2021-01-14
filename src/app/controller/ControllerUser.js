const express = require('express')
const router = express.Router()
const User = require('../model/User')
const Ballance = require('../model/Ballance')

router.post('/ballance', async(req, res)=>{
  
  const {user, year, months} = req.body

  const ballance = await Ballance.findOne({$and: [{user: user}, {year: year}]})
  if(!ballance){
    try {
      const newBallance = await Ballance.create(req.body)
      return res.send(newBallance)  
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  const {descriptions} = months
  console.log(months[0].descriptions)
  await ballance.update({
    months:[
      {month: months.month},
      
    ]
  })
  return res.send(ballance)
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