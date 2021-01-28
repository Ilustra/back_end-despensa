const express = require('express')
const router = express.Router()
const Cadastro = require('../model/Cadastro')



router.get('/:id', async (req, res) => {
  try {
    const { id} = req.params
    const cadastro = await Cadastro.findOne({user: id});

    return res.send(cadastro)

  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})

router.post('/', async (req, res) => {
  try {
    const {user} = req.body

    const _cadastro = await Cadastro.findOne({user: user});

    if(_cadastro){
      const {   
          firstName,lastName, email,cep, ddd, phone, localidade,bairro, uf, } = req.body
      const cadastroNew = {firstName,lastName, email,cep, ddd, phone, localidade,bairro, uf, 
      }
      await _cadastro.updateOne(cadastroNew)
      return res.send(_cadastro)
    }

    const cadastro = await Cadastro.create(req.body);

    return res.send(cadastro)

  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})
router.put('/', async (req, res)=>{

})
module.exports = router;