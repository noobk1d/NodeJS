const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
//DB CONNECTION
// const db = process.env.DATABASE.replace('<db_password>', process.env.PASSWORD);
// const db = process.env.DATABASE;
const db = 'mongodb://localhost:27017/demo';
mongoose.connect(db).then(async (con) => {
  console.log(con.connection.readyState);

  const number = await con.connection.db.listCollections().toArray();
  console.log(number.length);
  console.log('Connection successful');
});

//ENVIRONMENT VARIABLE
dotenv.config({ path: './config.env' });
console.log(process.env.NODE_ENV);
const port = 3000;

//SERVER START
app.listen(3000, () => {
  console.log(`App running on port ${port}`);
});
