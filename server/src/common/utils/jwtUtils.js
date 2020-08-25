const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");

const createToken = (type, subject, options = {}) => {
  let defaults = config.auth[type];
  let secret = options.secret || defaults.jwtSecret;
  let expiresIn = options.expiresIn || defaults.expiresIn;
  let payload = options.payload || {};

  return jwt.sign(payload, secret, {
    issuer: config.appName,
    expiresIn: expiresIn,
    subject: subject,
  });
};

module.exports = {
  createActivationToken: (subject, options = {}) => createToken("activation", subject, options),
  createPasswordToken: (subject, options = {}) => createToken("password", subject, options),
  createUserToken: (user, options = {}) => {
    let payload = { permissions: _.pick(user, ["isAdmin", "writeable"]) };

    return createToken("user", user.username, { payload, ...options });
  },
};
