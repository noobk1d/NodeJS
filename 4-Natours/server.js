const dotenv = require('dotenv');
const app = require('./app');

//ENVIRONMENT VARIABLE
dotenv.config({ path: './config.env' });
console.log(process.env.NODE_ENV);
const port = 3000;

//SERVER START
app.listen(3000, () => {
  console.log(`App running on port ${port}`);
});
