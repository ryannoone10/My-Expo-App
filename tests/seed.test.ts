// Unit test - verify seed function inserts data correctly
// Adapted from Week 12 Tutorial: https://ucc.instructure.com/courses/86289/files
// https://github.com/rorypierce111/react-native-lab/blob/main/tests/seed.test.ts
import { db } from '../db/index';
import { seed } from '../db/seed';

jest.mock('../db/index', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

const mockDb = db as unknown as { select: jest.Mock; insert: jest.Mock };

describe('seed', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inserts data when tables are empty', async () => {
    const mockValues = jest.fn().mockReturnValue({ returning: jest.fn().mockResolvedValue([{ id: 1, username: 'testuser', email: 'test@example.com', passwordHash: 'hashed', createdAt: 1000 }]) });
    const mockFrom = jest.fn().mockResolvedValue([{ count: 0 }]);

    mockDb.select.mockReturnValue({ from: mockFrom });
    mockDb.insert.mockReturnValue({ values: mockValues });

    await seed();

    expect(mockDb.insert).toHaveBeenCalled();
  });

  it('does not insert when users already exist', async () => {
    const mockFrom = jest.fn().mockResolvedValue([{ count: 1 }]);
    mockDb.select.mockReturnValue({ from: mockFrom });

    await seed();

    expect(mockDb.insert).not.toHaveBeenCalled();
  });
});