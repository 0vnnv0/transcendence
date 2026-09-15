// pages/NotFound.jsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl font-bold text-slate-800">404</h1>
      <p className="mt-4 text-lg text-slate-600">Page not found</p>
      <a href="/" className="mt-6 text-blue-600 hover:underline">Go back home</a>
    </div>
  );
}
