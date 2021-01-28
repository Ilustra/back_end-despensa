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
    .sort({emissao: -1})
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
            emissao:
            {
                $gte: startTime,  
                $lte: endTime
            }
        }).sort({emissao: -1})

        return res.send(notaMonth)
    } catch (error) {
        console.log(error)
        return res.status(400).send(error)
    }

})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const ballance = await NotaNfe.findById(id)
        await ballance.remove()
        return res.send(true)
    } catch (error) {
        console.log(error)
        return res.status(400).send(error)
    }

})

//inserir nota fiscal e relacionar 
router.post('/register', async (req, res) => {
    const { userId, url } = req.body

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
                let objectPagamento={
                    qtdTotalItens: 0 ,
                    valorTotal: 0 ,
                    descontos: 0 ,
                    valorPagar: 0 ,
                    formaPagamento: {
                         dinheiro: 0 ,
                         cartaoDebito: 0 ,
                         cartaoCredito: 0,
                         outros: 0,
                    },
                     tributos: 0 
                    }
                    $('#totalNota' ).find('div').each((index, element) =>{
                        //console.log($(element).text())
                        $(element).each((index2, element2)=>{
                            
                            const auxPagamento = $(element2).text().replace(/\s/g, ' ').trim()
                           // console.log(auxPagamento)
                            if(auxPagamento.indexOf('Qtd. total de itens:')> -1)
                            {
                                objectPagamento.qtdTotalItens=parseInt(auxPagamento.replace('Qtd. total de itens:', '').trim())
                            }
                            if(auxPagamento.indexOf('Valor total R$:')> -1)
                            {
                                objectPagamento.valorTotal= parseFloat(auxPagamento.replace('Valor total R$:', '').trim().replace(',', '.'))
                            }
                            if(auxPagamento.indexOf('Descontos R$:')> -1)
                            {
                                objectPagamento.descontos=parseFloat(auxPagamento.replace('Descontos R$:', '').trim().replace(',', '.'))
                            }
                            if(auxPagamento.indexOf('Valor a pagar R$:')>-1)
                            {
                                objectPagamento.valorPagar=parseFloat(auxPagamento.replace('Valor a pagar R$:', '').trim().replace(',', '.'))
                            }          
                            if(auxPagamento.indexOf('Cartão de Crédito')>-1)
                            {
                                objectPagamento.formaPagamento.cartaoCredito=parseFloat(auxPagamento.replace('Cartão de Crédito', '').trim().replace(',', '.'))
                            }
                            if(auxPagamento.indexOf('Dinheiro')>-1)
                            {
                                objectPagamento.formaPagamento.dinheiro =parseFloat(auxPagamento.replace('Dinheiro', '').trim().replace(',', '.'))
                            }
                            if(auxPagamento.indexOf('Outros')>-1)
                            {
                                objectPagamento.formaPagamento.outros =parseFloat(auxPagamento.replace('Outros', '').trim().replace(',', '.'))
                            }
                 
                            if(auxPagamento.indexOf('Cartão de Débito ')>-1)
                            {
                                //console.log(auxPagamento.first().text())
                                objectPagamento.formaPagamento.cartaoDebito =  parseFloat(auxPagamento.replace('Cartão de Débito 2', '').trim().replace(',', '.'))
                            }
                            if(auxPagamento.indexOf('Informação dos Tributos Totais Incidentes (Lei Federal 12.741/2012) R$')>-1)
                            {
                                objectPagamento.tributos=parseFloat(auxPagamento.replace('Informação dos Tributos Totais Incidentes (Lei Federal 12.741/2012) R$', '').trim().replace(',', '.'))
                            }
                        })
                    
                    })
                  //  console.log(objectPagamento)
                const TOTAL_Nota = $('span[class="totalNumb txtMax"]').last().text().replace(',', '.')
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
                //console.log('dataemissao', data_emissao)
                //dataEmisssao 
                const dia = data_emissao[0] + data_emissao[1]
                const month= data_emissao[3] + data_emissao[4] -1
                const ano =  data_emissao[6] + data_emissao[7] + data_emissao[8]+ data_emissao[9]
                const minute = data_emissao[11] + data_emissao[12]
                const segund = data_emissao[14] + data_emissao[15]
                const mili =data_emissao[17] + data_emissao[18]
                const emissaoDate = new Date(Date.UTC(ano, month, dia, minute, segund, mili))
                
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
                            'emissao': emissaoDate,
                            'empresa': Nome_fantasia
                        })
                })
         
           
                const scrapingNota = {
                    user: userId,
                    nome: Nome_fantasia,
                    cnpj: CNPJ,
                    rua: logradouro.toUpperCase(),
                    numero: numero_end,
                    localidade: localidade.toUpperCase(),
                    uf: uf.toUpperCase(),
                    bairro: bairro.toUpperCase(),
                    itens: objectPagamento.qtdTotalItens,
                    pagamento: objectPagamento.formaPagamento,
                    tributos: objectPagamento.tributos,
                    subTotal: objectPagamento.valorTotal > 0 ? objectPagamento.valorTotal: objectPagamento.valorPagar,
                    descontos: objectPagamento.descontos,
                    total: objectPagamento.valorPagar,
                    emissao: emissaoDate,
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
                        console.log('1', e)
                        return res.status(403).send({ error: 'Não foi possivel carregar sua nota, por favor tente novamente' })
                    }
            }else{
                console.log('8', e)
                return res.status(400).send(e)
            }

        })

    } catch (e) {
        console.log('----',e)
        return res.status(400).send(e)
    }
})
module.exports = router;