function validate(schema) {
  return (req, res, next) => {
    let result;
    try {
      result = schema.safeParse(req.body);
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: [{ field: '', message: err.message }],
      });
    }
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: result.error.issues.map((i) => ({
          field: i.path.join('.'),
          message: i.message,
        })),
      });
    }
    req.body = result.data;
    next();
  };
}

module.exports = { validate };
