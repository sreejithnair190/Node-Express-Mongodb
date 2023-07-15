const Review = require('./../models/reviewmodel');
const factory = require('./handlerFactory');

exports.setTourAndUserIds = (req, res, next) => {
    if(req.body.product) console.log(req.body.product);
    if(!req.body.user) req.body.user = req.user.id;
    next();
}

exports.get_reviews = factory.getAll(Review);
exports.get_review = factory.getOne(Review);
exports.create_review = factory.createOne(Review);
exports.update_review = factory.updateOne(Review);
exports.delete_review = factory.deleteOne(Review);