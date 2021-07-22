const express = require('express')
const cheerio = require('cheerio')
const request = require('request')
const Operation = require('../model/Operation')
const Conta = require('../model/Conta')

const router = express.Router()

router.get('/:userId', async (req, res) => {
    const { userId } = req.params
        const operation = await Operation.find({user: userId})
        return res.send(operation)
})
router.post('/', async (req, res) => {
    try {
        console.log(req.body)
        const {tipo, valor, userId} = req.body
        const conta = await Conta.findOne({user: userId})
      
        const operation = await Operation.create(req.body)
 
        if(tipo === 'DESPESA' ){
            conta.saldo = conta.saldo - valor
        }
        if(tipo === 'RECEITA'){
            conta.saldo = conta.saldo + valor
        }
        conta.extrato.unshift( operation._id)
        
        await conta.save()
 
        return res.send(operation)
    } catch (error) {
        console.log(error)
    }
    
})
router.delete('/:userId/:operationId', async (req, res) => {
    try {
        console.log('delete')
        const {userId, operationId} = req.params
       
        const conta = await Conta.findOne({user: userId})
        const operation = await Operation.findById(operationId);
 
        if(operation.tipo === 'DESPESA' ){
            conta.saldo = conta.saldo + operation.valor
        }
        if(operation.tipo === 'RECEITA'){
            conta.saldo = conta.saldo - operation.valor
        }
        conta.extrato = conta.extrato.filter(element=>{
            console.log(element)
            if(element != operationId)
                return element;
        })

        await operation.remove()

        await conta.save()
        return res.send(operation)
    
    } catch (error) {
        console.log(error)
    }
    
})
module.exports = router;