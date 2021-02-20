const express = require('express')

const User = require('../model/User')
const router = express.Router()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//const authConfig = require('../../config/auth')

const EXPIRES = 5259600;

function generateToken(params = {}, timeout = EXPIRES) {
  return jwt.sign(params, process.env.SECRET, {
    expiresIn: EXPIRES,
  });
}
router.post('/social', async(req, res)=>{
  try {
    //  console.log(req.body)
    const {name, email, provider, first_name, last_name, acess_social} =req.body
    //console.log(logInSocial)
    console.log(req.body)
    const {accessToken, expirationTime, accessTokenSource} = acess_social
    let  userSocial = await User.findOne({email})

    if(!userSocial)
        userSocial = await User.create({name, first_name, last_name, email, provider, password: accessToken })
   
    //console.log(userSocial)

    return res.status(200).send({
        _id: userSocial._id,
        name: userSocial.name,
        first_name: userSocial.first_name,
        last_name: userSocial.last_name,
        email: userSocial.email,
        despensa: userSocial.despensa,
        expirationTime,
        provider: accessTokenSource,
        token: accessToken,
    })
} catch (error) {
    console.log(error)
    return res.status(400).send({error:"Falha ao logogar    "})     
}
})
router.post('/User', async (req, res) => {
    const { email, name, password } = req.body

    try {
        if (await User.findOne({ email }))
            return res.status(400).send({ error: "Usuario com esse e-mail já está cadastrado!!" })

        if (email == '' || name == "" || password == "")
            return res.status(400).send({ error: 'Não é permitidos valores em branco, preencha todos os dados corretamente!!' })

        let user = await User.create(req.body)
        user.password = undefined
        user = await User.findById(user._id);
        user.notas = undefined

        const now = new Date();
        return res.status(200).send({
            _id: user._id,
            nome: user.nome,
            email: user.email,
            despensa: user.despensa,
            token: generateToken(({ id: user._id }))
        })

    } catch (err) {
        return res.status(400).send({ error: 'Falha ao realizar o cadastro, tente novamente!' })
    }
})

router.post('/authenticate', async (req, res) => {

    const { email, password } = req.body
    console.log(req.body)
    const { 'token-timeout': timeout = EXPIRES } = req.headers;
    try {
        const user = await User.findOne({ email }).select('+password')

        if (!user)
            return res.status(400).send({ error: 'Usuário com esse e-mail não foi encontrado, verifique se foi digitado corretamente' })

        if (!await bcrypt.compareSync(password, user.password))
            return res.status(400).send({ error: 'Invalid password' })

        user.password = undefined;
        user.notas = undefined;
        const now = new Date();
        res.send({ 
        _id: user._id,
        nome: user.nome,
        email: user.email,
        token: generateToken({ id: user.id }),
        loggedIn: now,
        expiresIn: new Date(now.getTime() + timeout * 1000),
        })
    } catch (e) { 
        console.log(e)
        return res.status(400).send(e) 
    }
})


module.exports = router;