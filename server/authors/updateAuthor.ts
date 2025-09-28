import { Request, Response } from 'express';
import { prisma } from '../prisma';

type UpdateAuthorParams = { id: string };
interface UpdateAuthorBody {
  name?: unknown;
}

export async function updateAuthor(
  req: Request<UpdateAuthorParams, unknown, UpdateAuthorBody>,
  res: Response,
) {
  try {
    const id = Number(req.params?.id);
    if (!id || Number.isNaN(id)) {
      res.status(400).json({ error: 'invalid id' });
      return;
    }

    const { name } = req.body ?? {};

    const data: { name?: string } = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        res.status(400).json({ error: 'name must be a non-empty string' });
        return;
      }
      data.name = name.trim();
    }

    if (Object.keys(data).length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    const a = await prisma.author.update({ where: { id }, data });

    res.json({ id: a.id, name: a.name, created_at: a.createdAt });
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
