const express = require('express')
const Despensa = require('../model/Despensa')
const User = require('../model/User')

const router = express.Router()

router.get('/:userId', async (req, res) => {
    const {userId} = req.params
    try {
     
    const despensa = await Despensa.find({$or:[{"user": userId},{"user_shareds.user":  userId}]})

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
    if(despensa.user == userId)
    return res.status(400).send({error: 'Impossivel adicionar esse usuário!'})
        const users = despensa.user_shareds.filter(element=>{
            if(element.user == userId){
                return element;
            }
        })
        if(users.length)
            return res.status(400).send({error: 'Esse usuário já está acicionado'});
    
    const  usershared = {user: userId, 'name': name, despensa: despensaId}
    despensa.user_shareds.push(usershared)
    const user = await User.findById(userId);
    user.despensa.push({despensa: despensaId});

        await user.update(user)
        await despensa.save();
    return res.send(usershared)
        
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
    const newItem = despensa.items.filter(element=>
    {
        if(element._id == itemId){
            return element;
        }
    })
    await despensa.save();
    return res.send(newItem.pop())

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
//lista exercicio repetição 4-9 12,14 16 
router.delete('/:_id/:userId', async (req, res) => {
    try {
        const{_id, userId} = req.params

        const despensa = await Despensa.findById(_id)

        if(despensa.user != userId)
        return res.status(400).send({error: 'Ops, apenas o proprietário pode deleter a despensa'})
        await despensa.delete();
        return res.send()

    } catch (error) {
        console.log(error);
        return res.status(400).send(error)
    }
})
module.exports = router;