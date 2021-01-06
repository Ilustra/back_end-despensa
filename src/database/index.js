const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL, {useUnifiedTopology: true});
mongoose.Promise = global.Promise;

module.exports = mongoose