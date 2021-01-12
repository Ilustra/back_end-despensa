const express = require('express')
const cheerio = require('cheerio')
const request = require('request')
const NotaNfe = require('../model/NotaNFE')
const User = require('../model/User')
const Ballance = require('../model/Ballance')
const router = express.Router()

router.get('/:userId', async (req, res) => {
    const { userId } = req.params
    let { limit = 2, skip = 1, orderby, sort = 'asc' } = req.query;
    const notas = await NotaNfe.find({user: userId})
    .sort({createdAt: -1})
    .limit(parseInt(limit))
    .skip((parseInt(skip) -1)* limit)
    return res.send(notas)

})
router.post('/month', async (req, res) => {
    try {
        const {userId, start, end} = req.body
        console.log(req.body)
        const startTime = new Date(start)
        const endTime=new Date(end)
    
        const notaMonth = await NotaNfe.find({user:userId, 
            createdAt:{$gte: startTime.getTime(),  
            $lte: endTime.getTime()}
        })

        return res.send(notaMonth)
    } catch (error) {
        console.log(error)
        return res.status(400).send(error)
    }

})

router.get('/ballance/:userId', async (req, res) => {
    const { userId } = req.params
    const ballance = await Ballance.find({ user: userId })
    return res.send(ballance)
})

//inserir nota fiscal e relacionar 
router.post('/register', async (req, res) => {
    const { userId, url } = req.body
    console.log(req.body)
    try {
     
        request(url, async function (error, response, html) {

            if (!error) {
                let $ = cheerio.load(html);
                //empresa
                const Nome_fantasia = $('div[class=txtTopo]').text()
                const CNPJ = $('div[class=text]').first().text().replace('CNPJ:', '').trim()
                let ENDERECO = $('div[class=text]').last().text().replace(/\s/g, ' ');
                var re = /\s*,\s*/;
                ENDERECO = ENDERECO.split(re)
                //
                const logradouro = ENDERECO[0]
                const numero_end = ENDERECO[1]
                const bairro = ENDERECO[ENDERECO.length - 3]
                const uf = ENDERECO[ENDERECO.length - 1];
                const localidade = ENDERECO[ENDERECO.length - 2];
                //
                const TOTAL_ITEMS = $('span[class=totalNumb]').first().text()
                const form_pagamento = $('label[class=tx]').first().text();
                const TOTAL_Nota = $('span[class=totalNumb]').last().text().replace(',', '.')
                let data_emissao
                $('#infos').find('div> div> ul > li').each((index, element) => {
                    let string = $(element).text()
                    if (string.indexOf(' Emissão:') > -1) {
                        let t = (string.replace(/\s/g, ' '))
                        t = t.substring(t.indexOf('Emissão:'), t.indexOf('- Via')).replace('Emissão:', '');
                        t = t.replace('/', '-')
                        t = t.replace('/', '-').trim()
                        data_emissao = t
                    }
                })
                //produtos
                const produto = [];
                $('table > tbody > tr ').each((index, element) => {
                    //codigo
                    const cod = $(element).find(`span[class=RCod]`).text().trim().replace('(Código:', '').replace(')', '');
                    //nome
                    const name = $(element).find(`span[class=txtTit2]`).text();
                    //quantidade
                    const quantidade = $(element).find(`span[class=Rqtd]`).text().replace('Qtde.:', '').trim().replace(',', '.');
                    //
                    //quantidade
                    const UN = $(element).find(`span[class=RUN]`).text().replace('UN:', '').trim();
                    //    
                    //quantidade
                    const valor = $(element).find(`span[class=RvlUnit]`).text().replace('Vl. Unit.:', '').trim().replace(',', '.');
                    //antidade
                    const total = $(element).find(`span[class=valor]`).text().trim().replace(',', '.');
                    //
                    produto.push(
                        {
                            'codigo': parseInt(cod),
                            'nome': name,
                            'quantidade': parseFloat(quantidade),
                            'UN': UN,
                            'valor': parseFloat(valor),
                            'total': parseFloat(total),
                            'emissao': data_emissao,
                            'empresa': Nome_fantasia
                        })
                })

                const scrapingNota = {
                    user: userId,
                    nome: Nome_fantasia,
                    cnpj: CNPJ,
                    rua: logradouro,
                    numero: numero_end,
                    localidade: localidade,
                    uf: uf,
                    bairro: bairro,
                    itens: parseInt(TOTAL_ITEMS),
                    pagamento: form_pagamento,
                    total: parseFloat(TOTAL_Nota),
                    emissao: data_emissao,
                    produtos: produto,
                    url: url,
                }
                try{
                const user = await User.findById(userId)
                if (!user)
                
                return res.status(400).send('Usuário não existe')
                const notaFiscal = await NotaNfe.findOne({ url: url })

                if(notaFiscal)
                return res.status(400).send({ error: 'Essa nota já foi adicionada' })

                const notas = await NotaNfe.create(scrapingNota)
                return res.send(notas)
                
                }catch(e){
                    return res.status(403).send({ error: 'Não foi possivel carregar sua nota, por favor tente novamente' })
                }
            }else{
                return res.status(400).send(e)
            }

        })

    } catch (e) {
        return res.status(400).send(e)
    }
})





module.exports = router;