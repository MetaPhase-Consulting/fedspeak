import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Home, FileCode } from 'lucide-react';

export default function Header() {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/docs', label: 'Docs', icon: BookOpen },
    { to: '/api-docs', label: 'Swagger', icon: FileCode },
  ];

  return (
    <header className='bg-white border-b border-slate-200'>
      <div className='container mx-auto px-6 py-4'>
        <div className='flex items-center justify-between'>
          <Link to='/' className='flex items-center space-x-3'>
            <div className='bg-blue-700 text-white font-bold text-lg px-3 py-1 rounded'>
              FS
            </div>
            <span className='text-xl font-bold text-slate-900'>FedSpeak</span>
          </Link>

          <nav className='flex items-center space-x-6'>
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                  location.pathname === to
                    ? 'text-blue-700'
                    : 'text-slate-600 hover:text-blue-700'
                }`}
              >
                <Icon className='w-4 h-4' />
                <span>{label}</span>
              </Link>
            ))}
            <a
              href='https://github.com/MetaPhase-Consulting/fedspeak'
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors'
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
