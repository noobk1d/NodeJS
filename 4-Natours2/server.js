const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
//DB CONNECTION
// const db = process.env.DATABASE.replace('<db_password>', process.env.PASSWORD);
const db = process.env.DATABASE;
mongoose.connect(db).then(async (con) => {
  console.log('Ready:', con.connection.readyState);
});
// .catch((err) => console.log('error:', err));

//ENVIRONMENT VARIABLE
// console.log(process.env.NODE_ENV);

const port = 3000;
//SERVER START
const server = app.listen(3000, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.error('UNHANDLED REJECTION! Shutting down...');
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.error(' UNCAUGHT EXCEPTION! Shutting down...');
  server.close(() => process.exit(1));
});

// console.log(x);
