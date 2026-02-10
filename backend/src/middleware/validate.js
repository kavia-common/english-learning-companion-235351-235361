const { ZodError } = require('zod');
const { ApiError } = require('./errors');

/**
 * PUBLIC_INTERFACE
 * Express middleware factory to validate request parts with Zod.
 * @param {{ body?: import('zod').ZodTypeAny, query?: import('zod').ZodTypeAny, params?: import('zod').ZodTypeAny }} schemas
 * @returns {import('express').RequestHandler}
 */
function validate(schemas) {
  return (req, res, next) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query) req.query = schemas.query.parse(req.query);
      if (schemas.params) req.params = schemas.params.parse(req.params);
      return next();
    } catch (e) {
      if (e instanceof ZodError) {
        return next(
          new ApiError(400, 'Invalid request', e.errors.map((er) => ({ path: er.path, message: er.message })))
        );
      }
      return next(e);
    }
  };
}

module.exports = {
  validate,
};
