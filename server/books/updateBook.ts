import { Request, Response } from 'express';
import { prisma } from '../prisma';

export async function updateBook(req: Request, res: Response) {
  try {
    const id = Number((req as any).params?.id);
    if (!id || Number.isNaN(id)) {
      res.status(400).json({ error: 'invalid id' });
      return;
    }

    const { title, author_id } = (req as any).body ?? {};

    const data: any = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        res.status(400).json({ error: 'title must be a non-empty string' });
        return;
      }
      data.title = title.trim();
    }

    if (author_id !== undefined) {
      const authorIdOrNull =
        author_id === null || author_id === '' ? null : Number(author_id);
      if (authorIdOrNull !== null && Number.isNaN(authorIdOrNull)) {
        res.status(400).json({ error: 'author_id must be a number or null' });
        return;
      }
      data.authorId = authorIdOrNull;
    }

    if (Object.keys(data).length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    const b = await prisma.book.update({
      where: { id },
      data,
      include: { author: { select: { name: true } } },
    });

    res.json({
      id: b.id,
      title: b.title,
      author_id: b.authorId ?? null,
      author: b.author?.name ?? null,
      created_at: b.createdAt,
    });
  } catch (e: any) {
    if (e?.code === 'P2003') {
      res
        .status(400)
        .json({ error: 'author_id does not reference an existing author' });
      return;
    }
    if (e?.code === 'P2025') {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    res.status(500).json({ error: (e as Error).message });
  }
}
