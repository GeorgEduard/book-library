import { Link } from 'react-router-dom';
import NavMenu from './NavMenu';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-emerald-200/60 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm group-hover:bg-emerald-500 transition-colors">
            📚
          </span>
          <span className="text-xl font-semibold tracking-tight text-slate-900">Book Library</span>
        </Link>
        <NavMenu />
      </div>
    </header>
  );
}
