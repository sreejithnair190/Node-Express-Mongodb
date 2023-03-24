const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({path:'./config.env'});

const db = process.env.DATABASE;

mongoose
.connect(db,{
    useNewUrlParser:true,
    // useCreateIndex:true,
    // useFindAndModify:false
})
.then(() =>  console.log('DB connection successful'))



// const testTour = new Tour ({
//     name:"The Forest Hiker",
//     rating:4.6,
//     price:232
// })
// testTour
//     .save()
//     .then(doc => console.log(doc))
//     .catch(err => console.log("error : ", err));

const app = require('./app');

const port = process.env.PORT || 6000;
app.listen(port, () => console.log(`App is running on port ${port}`));