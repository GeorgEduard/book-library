import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import type { PrismaClient } from '@prisma/client';
import { mockReq, mockRes } from './testUtils';

// Mock prisma used by handlers
vi.mock('../prisma', () => {
  const author = {
    create: vi.fn(),
  };
  return {
    prisma: { author } as unknown as PrismaClient,
  };
});

import { prisma } from '../prisma';
import { createAuthor } from '../authors/createAuthor';

describe('createAuthor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 if name is missing/invalid', async () => {
    const res = mockRes();
    await createAuthor(mockReq(undefined, {}), res);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'name is required' });
  });

  it('creates author and returns 201 with mapped fields', async () => {
    (prisma.author.create as unknown as Mock).mockResolvedValue({
      id: 1,
      name: 'Alice',
      createdAt: new Date('2020-01-01T00:00:00Z'),
    });
    const res = mockRes();
    await createAuthor(mockReq(undefined, { name: ' Alice ' }), res);
    expect(prisma.author.create).toHaveBeenCalledWith({ data: { name: 'Alice' } });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ id: 1, name: 'Alice', created_at: new Date('2020-01-01T00:00:00Z') });
  });
});
