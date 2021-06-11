const { Client } = require('pg');
const bcrypt = require('bcrypt');

const client = new Client({ database: 'edu', user: 'postgres' });
client.connect();
client.query(
  'UPDATE teacher SET pwd = $1 WHERE tea_id = $2',
  [bcrypt.hashSync('123456', 10), '123'],
  (err, res) => {
    console.log(err, res);
    process.exit(0);
  }
);
