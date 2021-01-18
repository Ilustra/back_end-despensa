const express = require('express')
const router = express.Router()
const Ocurrence = require('../model/Ocurrence')
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

module.exports = router;