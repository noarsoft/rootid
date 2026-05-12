const mockModel = () => ({
    findMany: jest.fn().mockResolvedValue([]),
    findFirst: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ rootid: 'mock-uuid-1', id: 1, ...data })),
    update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ rootid: where.rootid, id: 1, ...data })),
    updateMany: jest.fn().mockResolvedValue({ count: 0 }),
});

const prisma = {
    data_schema: mockModel(),
    view: mockModel(),
    form: mockModel(),
    data: mockModel(),
    $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
    $executeRaw: jest.fn().mockResolvedValue(1),
};

module.exports = prisma;
