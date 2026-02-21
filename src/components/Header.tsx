import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, FileCode, FileText, Home, Menu, Package, X } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/docs', label: 'Docs', icon: BookOpen },
    { to: '/scan', label: 'Text Scan', icon: FileText },
    { to: '/cli', label: 'CLI & npm', icon: Package },
    { to: '/api-docs', label: 'Swagger', icon: FileCode },
  ];

  return (
    <header className='bg-white border-b border-slate-200 relative z-50'>
      <div className='container mx-auto px-6 py-4'>
        <div className='flex items-center justify-between'>
          <Link to='/' className='flex items-center space-x-3'>
            <div className='bg-blue-700 text-white font-bold text-lg px-3 py-1 rounded'>
              FS
            </div>
            <span className='text-xl font-bold text-slate-900'>FedSpeak</span>
          </Link>

          {/* Desktop nav */}
          <nav className='hidden md:flex items-center space-x-6'>
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

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className='md:hidden p-2 text-slate-600 hover:text-blue-700 transition-colors'
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className='md:hidden border-t border-slate-200 bg-white'>
          <nav className='container mx-auto px-6 py-4 space-y-3'>
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center space-x-3 py-2 text-base font-medium transition-colors ${
                  location.pathname === to
                    ? 'text-blue-700'
                    : 'text-slate-600 hover:text-blue-700'
                }`}
              >
                <Icon className='w-5 h-5' />
                <span>{label}</span>
              </Link>
            ))}
            <a
              href='https://github.com/MetaPhase-Consulting/fedspeak'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center space-x-3 py-2 text-base font-medium text-slate-600 hover:text-blue-700 transition-colors'
            >
              <span>GitHub</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
