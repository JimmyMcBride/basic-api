const knex = require('knex');

// eslint-disable-next-line
const config = require('../../knexfile');

module.exports = knex(config[process.env.NODE_ENV || 'development']);
