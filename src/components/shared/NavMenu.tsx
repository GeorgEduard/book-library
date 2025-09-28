import { NavLink } from 'react-router-dom';

export default function NavMenu() {
  const baseLink = 'px-3 py-2 rounded-md text-sm transition-colors';
  const inactive = 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50';
  const active = 'text-emerald-800 bg-emerald-100 font-medium';

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [baseLink, isActive ? active : inactive].join(' ');

  return (
    <nav aria-label="Primary" className="flex items-center gap-1">
      <NavLink to="/" className={linkClass} end>
        Books
      </NavLink>
      <NavLink to="/authors" className={linkClass}>
        Authors
      </NavLink>
    </nav>
  );
}
