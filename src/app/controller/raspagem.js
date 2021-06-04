const express = require('express')
const cheerio = require('cheerio')
const request = require('request')
const router = express.Router()
//
router.get('/raspagem', async (req, res) => {
  const {url} = req.body
  
  request(url, function(error, response, html){
  //  console.log(html)
    if(!error){
      let $ = cheerio.load(html);
      //empresa
      const Nome_fantasia = $('div[class=txtTopo]').text()
      const CNPJ = $('div[class=text]').first().text().replace('CNPJ:','').trim()
      let ENDERECO = $('div[class=text]').last().text().replace(/\s/g, ' ');
      var re = /\s*,\s*/;
      ENDERECO = ENDERECO.split(re)
      //
      const logradouro = ENDERECO[0]
      const numero_end = ENDERECO[1]
      const bairro = ENDERECO[ENDERECO.length-3]
      const uf = ENDERECO[ENDERECO.length -1];
      const localidade = ENDERECO[ ENDERECO.length -2];
      //
      const TOTAL_ITEMS = $('span[class=totalNumb]').first().text()
      const form_pagamento = $('label[class=tx]').first().text();
      const TOTAL_Nota = $('span[class=totalNumb]').last().text().replace(',', '.')
      let data_emissao
      $('#infos').find('div> div> ul > li').each((index, element) =>{
        let string =$(element).text()
        if(string.indexOf(' Emissão:')> -1 ){
       let t = (string.replace(/\s/g, ' '))
          t=t.substring(t.indexOf('Emissão:'), t.indexOf('- Via')).replace('Emissão:', '');
          t=t.replace('/','-')
          t=t.replace('/','-')
          data_emissao = new Date(t)
      }
      })
      //produtos
      const produto = [];
      $('table > tbody > tr ').each((index, element) =>{
        //codigo
        const cod =$(element).find(`span[class=RCod]`).text().trim().replace('(Código:', '').replace(')','');
        //nome
        const name =$(element).find(`span[class=txtTit2]`).text();
        //quantidade
        const quantidade =$(element).find(`span[class=Rqtd]`).text().replace('Qtde.:','').trim().replace(',','.');
        //
        //quantidade
        const UN =$(element).find(`span[class=RUN]`).text().replace('UN:', '').trim();
        //    
        //quantidade
        const valor =$(element).find(`span[class=RvlUnit]`).text().replace('Vl. Unit.:', '').trim().replace(',', '.');
        //antidade
        const total =$(element).find(`span[class=valor]`).text().trim().replace(',', '.');
        //
        produto.push(
          {
          'codigo':parseInt(cod), 
          'nome': name, 
          'quantidade': parseFloat(quantidade), 
          'UN': UN, 
          'valor': parseFloat(valor), 
          'total': parseFloat(total),
          'emissao': data_emissao,
          'empresa': Nome_fantasia
        }) 
      })

      const notaNFE ={
        nome: Nome_fantasia,
        cnpj: CNPJ,
        rua: logradouro,
        numero: numero_end,
        localidade: localidade,
        uf: uf,
        bairro: bairro,
        itens: parseInt(TOTAL_ITEMS),
        total: parseFloat(TOTAL_Nota),
        pagamento: form_pagamento,
        emissao: data_emissao,
        produtos: produto,
      }
      return(res.send(notaNFE))
    }
  })
})

module.exports = app => app.use('/auth', router)