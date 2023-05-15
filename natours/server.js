const dotenv = require('dotenv');
const mongoose = require('mongoose');
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
.catch(err => console.error('DB connection failed:', err));

// const app = require('./app');

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`App is running on port ${port}`));