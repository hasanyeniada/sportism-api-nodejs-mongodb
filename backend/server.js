const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const server = require('./app');

console.log(server.get('env'));
console.log(process.env);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {})
  .then(con => {
    console.log(con.connections);
    console.log('DB Connection successful.');
});

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});