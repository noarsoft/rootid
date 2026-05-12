const { Prisma } = require('../../generated/prisma');

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, error: 'Record not found' });
    if (err.code === 'P2002') return res.status(409).json({ success: false, error: 'Duplicate record' });
    if (err.code === 'P2003') return res.status(400).json({ success: false, error: 'Invalid reference' });
    return res.status(400).json({ success: false, error: `Database error (${err.code}): ${err.message}` });
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({ success: false, error: 'Invalid request data' });
  }

  const status = err.status || 500;
  res.status(status).json({ success: false, error: status < 500 ? err.message : 'Internal Server Error' });
}

module.exports = { errorHandler };
