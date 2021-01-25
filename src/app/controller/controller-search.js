const express = require('express')
const NotaNfe = require('../model/NotaNFE')
const router = express.Router()

router.get('/:nome', async (req, res) => {
    const { nome } = req.params
    let { limit = 10, skip = 1, orderby, sort = 'asc', localidade='' } = req.query;
    const notas = await NotaNfe.find({$and:[{localidade: localidade},{"produtos.nome":  {$regex: nome, $options: 'i'}}]})
    .sort({emissao: -1})
    .limit(parseInt(limit))
    .skip((parseInt(skip) -1)* limit)
    .select('nome, localidade uf bairro emissao cnpj produtos')
    return res.send(notas)
})

module.exports = router;