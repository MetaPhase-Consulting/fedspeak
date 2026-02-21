import { Github } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className='bg-white border-t border-slate-200 py-8'>
      <div className='container mx-auto px-6'>
        <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
          <div className='text-sm text-slate-500'>
            &copy; {year} FedSpeak
          </div>

          <div className='flex items-center space-x-4 text-sm text-slate-500'>
            <div className='flex items-center space-x-2'>
              <Github className='w-4 h-4' />
              <a
                href='https://github.com/MetaPhase-Consulting/fedspeak'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-blue-700 transition-colors'
              >
                Open Source
              </a>
            </div>
            <span>|</span>
            <span>
              Built by{' '}
              <a
                href='https://metaphase.tech'
                target='_blank'
                rel='noopener noreferrer'
                className='text-orange-500 hover:text-orange-600 hover:underline transition-all duration-300 font-semibold'
              >
                MetaPhase
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
