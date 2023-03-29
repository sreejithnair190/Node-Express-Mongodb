const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
    name:{
        type:String,
        required: [true, 'A tour must have a name'],
        unique:true
    },
    price:{
        type:Number,
        required:[true, 'A tour must have a price']
    },
    duration:{
        type:Number,
        required:[true, 'A tour must have a duration']
    },
    maxGroupSize:{
        type:Number,
        required:[true, 'A tour must have a group size']
    },
    difficulty:{
        type:String,
        required:[true,'A tour must have a difficulty']
    },
    ratingAverage:{
        type:Number,
        default:4.5
    },
    ratingCount:{
        type:Number,
        default:0
    },
    summary:{
        type:String,
        trim:true,
        required:[true, 'A tour must have a description']
    },
    description:{
        type:String,
    },
    discount:Number,
    imageCover:{
        type:String,
        required:[true,'A tour must have an image']
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now()
    },
    startDates:[Date]
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour