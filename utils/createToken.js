const jwt = require('jsonwebtoken');
const createToken = (payload) => jwt.sign({ userId: payload }, process.env.jwt_secert_key, {
    expiresIn: process.env.jwt_expire_time,
});

module.exports = createToken;