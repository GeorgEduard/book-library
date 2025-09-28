import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import AuthorsPage from './pages/Authors';
import ReactModal from 'react-modal';
import Header from './components/shared/Header';

ReactModal.setAppElement('#root');

function RootLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-emerald-50 text-slate-900">
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <Header />
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  const router = createBrowserRouter([
    {
      element: <RootLayout />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/authors', element: <AuthorsPage /> },
      ],
    },
  ]);
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
