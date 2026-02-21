import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center py-32'>
      <h1 className='text-6xl font-bold text-slate-900 mb-4'>404</h1>
      <p className='text-xl text-slate-600 mb-8'>
        Page not found — that acronym doesn&apos;t decode to anything here.
      </p>
      <Link
        to='/'
        className='bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors'
      >
        Back to Home
      </Link>
    </div>
  );
}
