import { Request, Response } from 'express';
import { prisma } from '../prisma';

export async function findAuthors(_req: Request, res: Response) {
  try {
    const authors = await prisma.author.findMany({
      orderBy: { id: 'desc' },
      select: { id: true, name: true, createdAt: true, _count: { select: { Books: true } } },
    });
    const rows = authors.map(a => ({ id: a.id, name: a.name, created_at: a.createdAt, book_count: a._count.Books }));
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}
