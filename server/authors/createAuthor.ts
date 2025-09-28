import { Request, Response } from 'express';
import { prisma } from '../prisma';

export async function createAuthor(req: Request, res: Response) {
  try {
    const { name } = (req as any).body ?? {};

    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ error: 'name is required' });
      return;
    }

    const a = await prisma.author.create({ data: { name: name.trim() } });

    res.status(201).json({ id: a.id, name: a.name, created_at: a.createdAt });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}
