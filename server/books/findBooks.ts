import { Request, Response } from 'express';
import { prisma } from '../prisma';

export async function findBooks(_req: Request, res: Response) {
  try {
    const books = await prisma.book.findMany({
      orderBy: { id: 'desc' },
      include: { author: { select: { name: true } } },
    });
    const rows = books.map(b => ({
      id: b.id,
      title: b.title,
      author_id: b.authorId ?? null,
      author: b.author?.name ?? null,
      created_at: b.createdAt,
    }));

    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}
