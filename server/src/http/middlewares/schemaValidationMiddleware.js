module.exports = (req, next, schema) => {
  // eslint-disable-next-line no-unused-vars
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };
  const { error, value } = schema.validate(req.body, options);
  if (error) {
    next(new Error(`Validation error: ${error.details.map((x) => x.message).join(", ")}`));
  } else {
    req.body = value;
    next();
  }
};
