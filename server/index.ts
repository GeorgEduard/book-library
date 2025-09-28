import express from 'express';
import cors from 'cors';
import { findAuthors } from './authors/findAuthors';
import { findAuthor } from './authors/findAuthor';
import { createAuthor } from './authors/createAuthor';
import { updateAuthor } from './authors/updateAuthor';
import { deleteAuthor } from './authors/deleteAuthor';
import { findBooks } from './books/findBooks';
import { findBook } from './books/findBook';
import { createBook } from './books/createBook';
import { updateBook } from './books/updateBook';
import { deleteBook } from './books/deleteBook';
import { prisma } from './prisma';

const PORT = Number(process.env.PORT || 5174);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    const r = await prisma.$queryRaw<{ ok: number }[]>`select 1 as ok`;
    res.json({ status: 'ok', db: r[0]?.ok === 1 });
  } catch (e) {
    res.status(500).json({ status: 'error', error: (e as Error).message });
  }
});

// Find all authors
app.get('/api/authors', findAuthors);

// Find an author
app.get('/api/authors/:id', findAuthor);

// Create an author
app.post('/api/authors', createAuthor);

// Update an author
app.put('/api/authors/:id', updateAuthor);

// Delete an author
app.delete('/api/authors/:id', deleteAuthor);

// Find all books with author name joined
app.get('/api/books', findBooks);

// Find a book
app.get('/api/books/:id', findBook);

// Create a new book
app.post('/api/books', createBook);

// Update a book
app.put('/api/books/:id', updateBook);

// Delete a book
app.delete('/api/books/:id', deleteBook);

// Start server
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
