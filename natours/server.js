const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    process.exit(1);
})

const app = require('./app');

dotenv.config({path:'./config.env'});

const db = process.env.DATABASE;

mongoose
.connect(db,{
    useNewUrlParser:true,
    // useCreateIndex:true,
    // useFindAndModify:false
})
.then(() =>  console.log('DB connection successful'))

// const app = require('./app');

const port = process.env.PORT || 8000;
const server = app.listen(port, () => console.log(`App is running on port ${port}`));

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    server.close(() => process.exit(1));
})