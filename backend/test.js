// testConnection.js
const knex = require('./knex');

async function testConnection() {
  try {
    const result = await knex.raw('SELECT 1+1 AS result');
    console.log('Database connected successfully:', result[0][0]);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await knex.destroy();
  }
}

testConnection();
