const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const SportCenter = require('./../../models/sportCenterModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
const sportCenters = JSON.parse(
  fs.readFileSync(`${__dirname}/simple-sport-centers.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await SportCenter.create(sportCenters);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await SportCenter.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}