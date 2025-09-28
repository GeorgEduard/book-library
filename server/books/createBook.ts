import { Request, Response } from 'express';
import { prisma } from '../prisma';

interface CreateBookBody {
  title?: unknown;
  author_id?: unknown;
}

export async function createBook(
  req: Request<unknown, unknown, CreateBookBody>,
  res: Response,
) {
  try {
    const { title, author_id } = req.body ?? {};

    if (!title || typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ error: 'title is required' });
      return;
    }

    const authorIdOrNull =
      author_id === undefined || author_id === null || author_id === ''
        ? null
        : Number(author_id);

    if (authorIdOrNull !== null && Number.isNaN(authorIdOrNull)) {
      res.status(400).json({ error: 'author_id must be a number or null' });
      return;
    }

    const b = await prisma.book.create({
      data: { title: title.trim(), authorId: authorIdOrNull },
      include: { author: { select: { name: true } } },
    });

    res.status(201).json({
      id: b.id,
      title: b.title,
      author_id: b.authorId ?? null,
      author: b.author?.name ?? null,
      created_at: b.createdAt,
    });
  } catch (e: unknown) {
    if (
      e &&
      typeof e === 'object' &&
      'code' in e &&
      typeof (e as { code?: unknown }).code === 'string' &&
      (e as { code: string }).code === 'P2003'
    ) {
      res
        .status(400)
        .json({ error: 'author_id does not reference an existing author' });
      return;
    }
    res.status(500).json({ error: (e as Error).message });
  }
}
