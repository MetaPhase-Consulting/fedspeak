import { Code, FileText, Package, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Search,
    title: 'Advanced Search',
    description:
      'Browse, filter by category or agency, and sort all acronyms in the database.',
    link: '/search',
    linkLabel: 'Search',
  },
  {
    icon: FileText,
    title: 'Text Scanning',
    description:
      'Paste a block of text and FedSpeak finds every government acronym.',
    link: '/scan',
    linkLabel: 'Try Text Scan',
  },
  {
    icon: Package,
    title: 'Package',
    description:
      'Install via npm for use in your Node.js and TypeScript projects.',
    link: '/package',
    linkLabel: 'View Package',
  },
  {
    icon: Code,
    title: 'REST API',
    description:
      'GET and POST support with JSON responses, CORS enabled. Ready for any integration.',
    link: '/docs',
    linkLabel: 'API Docs',
  },
];

export default function FeatureCards() {
  return (
    <section className='py-16 bg-slate-50'>
      <div className='container mx-auto px-6'>
        <h2 className='text-3xl font-bold text-slate-900 text-center mb-12'>
          Features
        </h2>
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {features.map(({ icon: Icon, title, description, link, linkLabel }) => (
            <div
              key={title}
              className='bg-white p-6 rounded-lg border border-slate-200 hover:shadow-md transition-shadow'
            >
              <div className='bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4'>
                <Icon className='w-5 h-5 text-blue-700' />
              </div>
              <h3 className='font-semibold text-slate-900 mb-2'>{title}</h3>
              <p className='text-sm text-slate-600'>{description}</p>
              {link && (
                <Link
                  to={link}
                  className='text-sm text-blue-600 hover:text-blue-800 hover:underline mt-3 inline-block font-medium'
                >
                  {linkLabel} &rarr;
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
