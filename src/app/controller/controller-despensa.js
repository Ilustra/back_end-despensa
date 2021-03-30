const express = require('express')
const Despensa = require('../model/Despensa')
const User = require('../model/User')

const router = express.Router()

router.get('/:userId', async (req, res) => {
    const {userId} = req.params
    try {
     
  //  const despensa = await Despensa.findOne({user: userId});
    //const despensaShares = await Despensa.findOne({user_shareds: userId})
    //console.log(despensaShares)

    const despensa = await Despensa.find({$or:[{"user": userId},{"user_shareds.user":  userId}]})
    console.log(despensa)
    return res.send(despensa)   
    } catch (error) {
        console.log(error)
        return res.status(400).send(error)
    }
})
router.post('/user', async(req, res)=>{
    const {despensaId, userId, name} = req.body
    try {
    
    const despensa = await Despensa.findById(despensaId);
        const users = despensa.user_shareds.filter(element=>{
            if(element.user == userId){
                return element;
            }
        })

        console.log(users)
        if(users.length)
            return res.status(400).send({error: 'Esse usuário já está acicionado'});
    
   
    despensa.user_shareds.push({user: userId, 'name': name, despensa: despensaId})


    const user = await User.findById(userId);
    //console.log(user)
    const t ={
        despensa: despensaId
    }
    user.despensa.push(t);

   await user.update(user)
    await despensa.save();
    return res.send(despensa)
        
} catch (error) {
    console.log(error)
    return res.status(400).send({error: 'Ops'})       
}
})
router.delete('/user', async(req, res)=>{
    const {despensaId, userId} = req.body
    
    const despensa = await Despensa.findById(despensaId);
    if(despensa.user != userId)
        return res.status(400).send({error: 'Ops! apenas o proprietario pode excluir usuários!'})
        const users = despensa.user_shareds.filter(element=>{
            if(element._id != userId){
                return element;
            }
        })
   
    despensa.user_shareds = users
    await despensa.save();
    
    return res.send(despensa)
})
router.post('/create', async (req, res) => {
    try {
        const despensa = await Despensa.create(req.body)
        return res.send(despensa)
    } catch (error) {
        console.log(error);
        return res.status(400).send(error)
    }
})
router.post('/produto', async (req, res) => {
    try {
        const{items, user, dateUpdate, userName, despensaId } = req.body
        const despensa = await Despensa.findById(despensaId)
        despensa.userUpdate = userName
        despensa.updatedAt = dateUpdate
        await items.forEach(element => {
            despensa.items.push(element);    
        });
    
        await despensa.save()
        return res.send()

    } catch (error) {
        console.log(error);
        return res.status(400).send(error)
    }
})
//22209199376
router.put('/produto', async (req,res)=>{
    const {userId,itemId, status, openDate, nivel, updatedAt, name, UN, quantidade, valor, total, validade, updateUser, categoria} = req.body
    console.log(req.body)
    const despensa = await Despensa.findOne({user: userId})
    despensa.userUpdate = updateUser
    despensa.updatedAt = updatedAt
    despensa.items = despensa.items.map(element=>{
        if(element._id == itemId){
            return {
                        _id: element._id,
                        status: status,
                        openDate: openDate,
                         nivel: nivel,
                        user: element.user,
                        updatedAt: updatedAt,
                        name: name,
                        UN: UN,
                        quantidade: quantidade,
                        valor: valor,
                        total: total,
                        validade: validade,
                        updateUser: updateUser,
                        createdAt: element.createdAt,
                        categoria:  categoria,
                        
            }
        }else
        return element;
    })
    
    await despensa.save();
    return res.send(despensa)

})
router.delete('/produto', async (req, res) => {
    try {
        const{user, itemId} = req.body

        let despensa = await Despensa.findOne({user})
        const newItems = despensa.items.filter(element=>{
            if(element._id != itemId){
                return element
            }
        })
        despensa.items = newItems;
        await despensa.save()
        return res.send(true)

    } catch (error) {
        console.log(error);
        return res.status(400).send(error)
    }
})

module.exports = router;