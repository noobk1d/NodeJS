const dotenv = require('dotenv');
const app = require('../../app');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../model/tourModel');

dotenv.config({ path: '../../config.env' });

//DB CONNECT
const db = process.env.DATABASE;
mongoose.connect(db).then(async (con) => {
  console.log('Ready:', con.connection.readyState);
});

//READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf8')
);
console.log(typeof tours);

//IMPORTING
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully imported');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//Delete data
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
