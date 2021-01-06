const { ValidationError } = require('express-json-validator-middleware');
const { ResponseError } = require('../../schemas/error');

/**
 * Função para enviar erros de validação de requisições feitas aos recursos da API.
 * @param {*} err 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const sendValidationErrors = (err, req, res, next) => {
    if (err instanceof ValidationError) {
        let errors = err.validationErrors.body.map(e => new ResponseError(
            'validation',
            e.message,
            {
                type: e.keyword,
                property: e.dataPath + (e.params.missingProperty ? "." + e.params.missingProperty : ""),
                fullError: e
            }
        ));

        // At this point you can execute your error handling code
        res.setHeader('Content-type', 'application/json');
        res.status(400).json(errors);
        //next();
    } else next(err); // pass error on if not a validation error
};


module.exports = {
    sendValidationErrors
}