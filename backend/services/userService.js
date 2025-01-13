const knex = require('../knex'); 

const getAllUsers = async () => {
  return [
    { id: 1, name: 'Izayah Gibson', email: 'izayahgibson@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
  ];
};

module.exports = { getAllUsers };