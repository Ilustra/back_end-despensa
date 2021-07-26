const  express = require('express')

const router = express.Router()

//const authMiddleware = require('../middlewares/auth')

//router.use(authMiddleware)

router.get('/app-ads.txt', (req, res)=> {
   return res.send('google.com, pub-7017548991231781, DIRECT, f08c47fec0942fa0')
})

module.exports = router;