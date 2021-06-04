/**
 * Middleware genérico para buscar todos os objetos de uma Classe/Modelo
 * gerenciado pelo Sequelize.
 */
const findAll = (AnySequelizeModel, attributes) => {
  return async (req, res, next) => {
    let { limit = 20, page = 1, orderby, order = 'asc' } = req.query;

    try {
      const options = {
        offset: limit * (page - 1),
        limit
      };

      if (order.toLowerCase() === 'desc' || order.toLowerCase() === 'd') order = 'desc';
      else order = 'asc';

      if (attributes) options.attributes = attributes;

      if (orderby) options.order = [[orderby, order]];

      return res.status(200).json(await AnySequelizeModel.findAll(options));
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  };
};


/**
 * Middleware genérico para deletar um objeto.
 */
const deleteObject = (AnySequelizeModel) => {
  return async (req, res, next) => {
    const { id } = req.params;

    try {
      const obj = await AnySequelizeModel.findByPk(id);
      if (!obj) return res.status(404).json({ message: 'Object not found' });

      await obj.destroy();
      return res.send();
    } catch (error) {
      console.log(error)
      return res.status(400).json(error);
    }
  };
};

module.exports = {
  findAll,
  deleteObject
};
