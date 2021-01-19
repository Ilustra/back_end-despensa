const express = require('express')
const router = express.Router()
const Ocurrence = require('../model/Ocurrence')
const Ballance = require('../model/Ballance')
router.post('/', async (req, res)=>{
    console.log(req.body)

    try {
        const ocurrence = await Ocurrence.create(req.body)
        return res.send(ocurrence)
    } catch (error) {
        console.log(error)
        return res.status(400).send(error)
    }
})
router.get('/', async(req, res)=>{
    const {year, id} = req.body
    const ballance = await Ballance.findOne({$and: [{user: id}, {year: year}]})
    if(ballance)
     console.log(ballance)
    return res.send(ballance)
})
module.exports = router;