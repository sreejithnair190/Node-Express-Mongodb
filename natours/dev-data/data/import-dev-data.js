const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs')

const Tour = require('./../../models/tourModel');

dotenv.config({path:'./config.env'});

const db = process.env.DATABASE;

mongoose
.connect(db,{
    useNewUrlParser:true,
})
.then(() =>  console.log('DB connection successful'))

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log("Tour Data have been imported");
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log("All tours have been deleted");
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

console.log(process.argv);

if(process.argv[2] === '--import'){
    importData();
}else if (process.argv[2] === '--delete') {
    deleteData();
}