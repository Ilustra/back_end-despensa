//var ResponseError = require('../schemas/error').ResponseError;

/**
 * Enviar mensagens de erro para o cliente.
 *
 * @param { Response } response
 * @param { Number } code
 * @param { ResponseError | Array<ResponseError> } messages
 */
exports.sendError = function (response, code, messages) {
    console.error(messages);
    if (!Array.isArray(messages)) {
        messages = [messages];
    }
    response.setHeader('Content-type', 'application/json');
    return response.status(code).send(JSON.stringify(messages));
};
