require('dotenv').config();
const jwt = require('jsonwebtoken');
const httpHelper = require('../helper/http-helper');
const request = require('request');
const { resolve } = require('path');

var admin = require('firebase-admin');
var serviceAccount = require("../../../app-mobile-ilustra-firebase-adminsdk-2qwz5-1763adfc21.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const URL_APP_TOKEN = `https://graph.facebook.com/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&grant_type=client_credentials`
const URL_TOKEN_USER =(INPUT_TOKEN, ACCESS_TOKEN)=>{return `https://graph.facebook.com/debug_token?input_token=${INPUT_TOKEN}&access_token=${ACCESS_TOKEN}`}

async function OauthTOkenAPP(url){
  return new Promise((resolve, reject)=>{
    request.get({url:url}, (err, response, data)=>{
      resolve(data)
    })
  
  })
}  

async function onDeputareToken(url){
  return new Promise((resolve, reject)=>{
    request.get({url:url}, (err, response, data)=>{
      if(err)
        reject(err)

      resolve(data)
    })
  
  })
}

  const isAuthorized  = async (req, res, next) => {

    const { authorization, provider } = req.headers;
    
    if (!authorization) {
      return httpHelper.sendError(res, 403, { category: 'authentication', message: 'No authentication token' });
    }
    
    if(provider ==="FACEBOOK_APPLICATION_WEB"){
      try {
        const oauthTOken =JSON.parse(await OauthTOkenAPP(URL_APP_TOKEN)) 
        console.log('->',oauthTOken)
        const isOauthUser =JSON.parse(await onDeputareToken(URL_TOKEN_USER(authorization,oauthTOken.access_token))) 
  
        const {user_id, is_valid, expires_at, scopes, error} = isOauthUser.data
        
        if(error)
          return httpHelper.sendError(res, 401, { category: 'authentication',  message: error.message });
        
        if(is_valid)
          return next();
        
        return httpHelper.sendError(res, 401, { category: 'authentication', message: 'Failed to authenticate token' });
      } catch (error) {
        return httpHelper.sendError(res, 401, { category: 'authentication', message: 'Failed to authenticate token' });
      }
    }
    
    if(provider==='firebase'){
      admin
      .auth()
        .verifyIdToken(authorization)
        .then((decodedToken) => {
          // ...
          return next();
          //return rerro para teste
         //return httpHelper.sendError(res, 401, { category: 'authentication', message: 'Failed to authenticate token' });
        })
      .catch((error) => {
        // Handle error
        console.log('firebase',error)
        return httpHelper.sendError(res, 401, { category: 'authentication', message: 'Failed to authenticate token' });
      });
    }
    if(provider=='API-SERVICE'){
      jwt.verify(authorization, process.env.SECRET, (err, decoded) => {
      if (err) return httpHelper.sendError(res, 401, { category: 'authentication', message: 'Failed to authenticate token' });

      // se tudo estiver ok, salva no request para uso posterior
      req.user = { id: decoded.id, isAdmin: decoded.isAdmin };
      return next();
    });
    }
  };



const isAdmin = async (req, res, next) => {
  const { isAdmin, id } = req.user;
  const { originalUrl, baseUrl, method} = req;
  console.log(method)
 /*
  if(!isAdmin)
    if(baseUrl == '/user')
      if(method =='GET' && req.params.id == id )
        return next()
      if(method =='PUT' && req.body.id == id )
        return next()    
*/
  return !isAdmin ? httpHelper.sendError(res, 403, { category: 'authorization', message: 'No authorized, only administrator.' }) : next();

};


module.exports = { isAuthorized, isAdmin};
