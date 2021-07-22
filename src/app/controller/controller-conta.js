const express = require('express')
const cheerio = require('cheerio')
const request = require('request')
const Conta = require('../model/Conta')

const router = express.Router()

router.get('/:userId', async (req, res) => {
    const { userId } = req.params
        let conta = await Conta.findOne({user: userId}).populate('extrato')
  
        if(!conta)
            conta = await Conta.create({user: userId, description: '', saldo: 0, tipo: 'PRINCIPAL'})

            
        return res.send(conta)
})
router.post('/lancamento', async (req, res) => {
    try {
        const conta = await Conta.findOne({user: userId})
        conta.saldo = conta.saldo + req.body.valor
        await conta.save();
        return res.send(conta)
    } catch (error) {
        
    }
    
})
router.put('/', async (req, res) => {

        console.log(req.body)
        const{userId, valor} = req.body
        const conta = await Conta.findOne({user: userId}).populate('extrato')
        
        conta.saldo = parseFloat(valor) 
        await conta.save();
        return res.send(conta)
 
    
})
module.exports = router;