const { Prisma } = require('../../generated/prisma');

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Record not found' });
    if (err.code === 'P2002') return res.status(409).json({ error: 'Duplicate record' });
    if (err.code === 'P2003') return res.status(400).json({ error: 'Invalid reference' });
    return res.status(400).json({ error: 'Database error' });
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  res.status(err.status || 500).json({ error: 'Internal Server Error' });
}

module.exports = { errorHandler };
