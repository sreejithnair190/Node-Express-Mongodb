const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
    name:{
        type:String,
        required: [true, 'A tour must have a name'],
        unique:true
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
    ratingsAverage:{
        type:Number,
        default:4.5
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true, 'A tour must have a price']
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