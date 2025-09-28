export interface Book {
  id: number;
  title: string;
  author_id: number | null;
  author: string | null;
  created_at: Date;
}

export interface Author {
  id: number;
  name: string;
  created_at: Date;
  book_count?: number;
}
