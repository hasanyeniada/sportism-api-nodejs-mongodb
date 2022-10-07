const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const server = require('./app');

console.log(server.get('env'));
console.log(process.env);

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});