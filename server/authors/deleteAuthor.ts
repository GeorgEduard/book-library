import { Request, Response } from 'express';
import { prisma } from '../prisma';

export async function deleteAuthor(req: Request, res: Response) {
  try {
    const id = Number((req as any).params?.id);
    if (!id || Number.isNaN(id)) {
      res.status(400).json({ error: 'invalid id' });
      return;
    }

    await prisma.author.delete({ where: { id } });

    res.status(204).end();
  } catch (e: any) {
    if (e?.code === 'P2025') {
      res.status(404).json({ error: 'Author not found' });
      return;
    }
    res.status(500).json({ error: (e as Error).message });
  }
}
