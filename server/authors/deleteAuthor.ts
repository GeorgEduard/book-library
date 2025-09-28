import { Request, Response } from 'express';
import { prisma } from '../prisma';

type DeleteAuthorParams = { id: string };

export async function deleteAuthor(
  req: Request<DeleteAuthorParams>,
  res: Response,
) {
  try {
    const id = Number(req.params?.id);
    if (!id || Number.isNaN(id)) {
      res.status(400).json({ error: 'invalid id' });
      return;
    }

    await prisma.author.delete({ where: { id } });

    res.status(204).end();
  } catch (e: unknown) {
    if (
      e &&
      typeof e === 'object' &&
      'code' in e &&
      typeof (e as { code?: unknown }).code === 'string' &&
      (e as { code: string }).code === 'P2025'
    ) {
      res.status(404).json({ error: 'Author not found' });
      return;
    }
    res.status(500).json({ error: (e as Error).message });
  }
}
