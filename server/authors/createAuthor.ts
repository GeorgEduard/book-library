import { Request, Response } from 'express';
import { prisma } from '../prisma';

interface CreateAuthorBody {
  name?: unknown;
}

export async function createAuthor(
  req: Request<unknown, unknown, CreateAuthorBody>,
  res: Response,
) {
  try {
    const { name } = req.body ?? {};

    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ error: 'name is required' });
      return;
    }

    const a = await prisma.author.create({ data: { name: name.trim() } });

    res.status(201).json({ id: a.id, name: a.name, created_at: a.createdAt });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
}
