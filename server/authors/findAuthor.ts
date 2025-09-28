import { Request, Response } from 'express';
import { prisma } from '../prisma';

export async function findAuthor(req: Request, res: Response) {
  try {
    const authorId = Number(req.params.id);
    if (isNaN(authorId)) {
      return res.status(400).json({ error: 'Invalid author id' });
    }

    const a = await prisma.author.findUnique({ where: { id: authorId }, select: { id: true, name: true, createdAt: true, _count: { select: { Books: true } } } });
    if (!a) {
      return res.status(404).json({ error: 'Author not found' });
    }

    const row = { id: a.id, name: a.name, created_at: a.createdAt, book_count: a._count.Books };
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}
