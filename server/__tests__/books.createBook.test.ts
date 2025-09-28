import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { PrismaClient } from '@prisma/client';
import { mockReq, mockRes } from './testUtils';

vi.mock('../prisma', () => {
  const book = {
    create: vi.fn(),
  };
  return { prisma: { book } as unknown as PrismaClient };
});

import { prisma } from '../prisma';
import { createBook } from '../books/createBook';

describe('createBook', () => {
  beforeEach(() => vi.clearAllMocks());

  it('validates title is required', async () => {
    const res = mockRes();
    await createBook(mockReq(undefined, { title: '' }), res);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'title is required' });
  });

  it('maps P2003 to friendly error when author_id invalid', async () => {
    (prisma.book.create as any).mockRejectedValue({ code: 'P2003' });
    const res = mockRes();
    await createBook(mockReq(undefined, { title: 'A', author_id: 1234 }), res);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'author_id does not reference an existing author' });
  });

  it('creates book and returns mapped fields', async () => {
    (prisma.book.create as any).mockResolvedValue({
      id: 10,
      title: 'A',
      authorId: 2,
      author: { name: 'Alice' },
      createdAt: new Date('2021-01-01T00:00:00Z'),
    });
    const res = mockRes();
    await createBook(mockReq(undefined, { title: ' A ', author_id: '2' }), res);
    expect(prisma.book.create).toHaveBeenCalledWith({ data: { title: 'A', authorId: 2 }, include: { author: { select: { name: true } } } });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ id: 10, title: 'A', author_id: 2, author: 'Alice', created_at: new Date('2021-01-01T00:00:00Z') });
  });
});
