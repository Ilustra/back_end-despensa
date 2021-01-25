const express = require('express')

const Ballance = require('../model/Ballance')
const router = express.Router()

router.get('/:userId', async (req, res) => {
    const { userId } = req.params
    const ballance = await Ballance.find({ user: userId })
    return res.send(ballance)
})
router.post('/', async(req, res)=>{
  
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
  
    return res.send(ballance)
  })

module.exports = router;