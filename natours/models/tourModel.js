const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = mongoose.Schema({
    name:{
        type:String,
        required: [true, 'A tour must have a name'],
        unique:true
    },
    slug: String,
    secret:{
        type:Boolean,
        default:false
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
        default:Date.now(),
        select:false,
    },
    startDates:[Date]
},{
    toJSON: { virtuals : true },
    toObject: { virtuals: true }
})

tourSchema
    .virtual('durationWeeks')
    .get(function () {
        return this.duration / 7
    })

// Document Middleware
tourSchema.pre('save', function (next){
    this.slug = slugify(this.name, { lower :true });
    next();
})

// Query Middleware
tourSchema.pre(/^find/, function(next){

    this.start = Date.now();
    this.find( { secret : { $ne : true } })
    next();
});

tourSchema.post(/^find/, function(docs, next){
    console.log(`Query Took ${ Date.now() - this.start } ms`);
    next()
});


// Aggregation Middleware
tourSchema.pre('aggregate', function(){
    this.pipeline().unshift( {$match : { secret:  { $ne : true }}});
    console.log(this.pipeline());
})


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour