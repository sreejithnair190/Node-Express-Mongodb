const jwt = require('jsonwebtoken');

exports.generateAuthToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.decode = (token) => jwt.verify(token, process.env.JWT_SECRET);
