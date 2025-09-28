import type { ReactNode } from 'react';

export default function SectionCard({
  title,
  children,
  description,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-white shadow-sm ring-1 ring-emerald-100 rounded-xl p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-slate-600 mt-1">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}
