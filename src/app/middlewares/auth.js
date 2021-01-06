require('dotenv').config();
const jwt = require('jsonwebtoken');
const httpHelper = require('../helper/http-helper');

  const isAuthorized = (req, res, next) => {
    const { authorization } = req.headers;
  
    if (!authorization) {
      return httpHelper.sendError(res, 403, { category: 'authentication', message: 'No authentication token' });
    }
  
    jwt.verify(authorization, process.env.SECRET, (err, decoded) => {
      console.log(decoded);
      if (err) return httpHelper.sendError(res, 401, { category: 'authentication', message: 'Failed to authenticate token' });
  
      // se tudo estiver ok, salva no request para uso posterior
      req.user = { id: decoded.id, isAdmin: decoded.isAdmin };
      return next();
    });
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
