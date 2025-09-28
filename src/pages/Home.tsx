import { useBooks } from '../hooks/useBooks';
import BooksSection from '../components/books/BooksSection';

export default function Home() {
  const {
    data: books = [],
    isLoading: isBooksLoading,
    error: booksError,
  } = useBooks();
  return (
    <BooksSection books={books} isLoading={isBooksLoading} error={booksError} />
  );
}
