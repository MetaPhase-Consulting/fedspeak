import { Search, FileText, Zap, Globe } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Single Lookup',
    description:
      'Send any acronym and get the full expansion, description, agency, and category.',
  },
  {
    icon: FileText,
    title: 'Text Scanning',
    description:
      'Paste a block of text and FedSpeak finds and decodes every government acronym.',
  },
  {
    icon: Zap,
    title: 'Instant API',
    description:
      'REST API with GET and POST support. JSON responses, CORS enabled, ready for integration.',
  },
  {
    icon: Globe,
    title: 'Join39 Ready',
    description:
      'Built for the Join39 Agent Store. Automatic response truncation for 2000-char compliance.',
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
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className='bg-white p-6 rounded-lg border border-slate-200 hover:shadow-md transition-shadow'
            >
              <div className='bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4'>
                <Icon className='w-5 h-5 text-blue-700' />
              </div>
              <h3 className='font-semibold text-slate-900 mb-2'>{title}</h3>
              <p className='text-sm text-slate-600'>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
