const  express = require('express')

const router = express.Router()

//const authMiddleware = require('../middlewares/auth')

//router.use(authMiddleware)

router.get('/', (req, res)=> {
   console.log('4')
   return res.send({status: true, UsuarioId: req.userId})
})

module.exports = router;