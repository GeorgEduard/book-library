import { Request, Response } from 'express';
import { prisma } from '../prisma';

export async function findBook(req: Request, res: Response) {
  try {
    const bookId = Number(req.params.id);
    if (isNaN(bookId)) {
      return res.status(400).json({ error: 'Invalid book id' });
    }
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: { author: { select: { name: true } } },
    });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    const row = {
      id: book.id,
      title: book.title,
      author_id: book.authorId ?? null,
      author: book.author?.name ?? null,
      created_at: book.createdAt,
    };
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}
