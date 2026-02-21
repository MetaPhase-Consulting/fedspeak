import { BookOpen, Code, Terminal, Package, Search, FileText, Globe, FolderGit2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className='bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-sm'>
      <code>{children}</code>
    </pre>
  );
}

function QuickLink({ to, icon: Icon, label, description, external }: {
  to: string;
  icon: React.ElementType;
  label: string;
  description: string;
  external?: boolean;
}) {
  const cls = 'group flex items-start space-x-4 p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all bg-white';
  const inner = (
    <>
      <div className='bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5'>
        <Icon className='w-5 h-5 text-blue-700' />
      </div>
      <div className='min-w-0'>
        <div className='flex items-center space-x-1'>
          <span className='font-semibold text-slate-900 group-hover:text-blue-700 transition-colors'>{label}</span>
          {external && <ExternalLink className='w-3 h-3 text-slate-400' />}
        </div>
        <p className='text-sm text-slate-600 mt-0.5'>{description}</p>
      </div>
    </>
  );

  if (external) {
    return (
      <a href={to} target='_blank' rel='noopener noreferrer' className={cls}>
        {inner}
      </a>
    );
  }

  return (
    <Link to={to} className={cls}>
      {inner}
    </Link>
  );
}

export default function Docs() {
  return (
    <section className='py-12 md:py-16'>
      <div className='container mx-auto px-6 max-w-4xl'>
        <div className='flex items-center justify-center space-x-3 mb-4'>
          <BookOpen className='w-8 h-8 text-blue-700' />
          <h1 className='text-3xl md:text-4xl font-bold text-slate-900'>Documentation</h1>
        </div>
        <p className='text-center text-slate-600 mb-10 max-w-2xl mx-auto'>
          FedSpeak is an open-source federal acronym decoder built by{' '}
          <a href='https://metaphase.tech' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>
            MetaPhase
          </a>. Decode thousands of U.S. government acronyms via website, REST API, npm package, or CLI.
        </p>

        {/* Quick Links */}
        <div className='mb-12'>
          <h2 className='text-xl font-bold text-slate-900 mb-4'>Quick Links</h2>
          <div className='grid sm:grid-cols-2 gap-3'>
            <QuickLink to='/search' icon={Search} label='Search' description='Browse, filter, and sort all acronyms' />
            <QuickLink to='/scan' icon={FileText} label='Text Scan' description='Paste text to find all acronyms' />
            <QuickLink to='/api' icon={Code} label='API Reference' description='Interactive Swagger UI documentation' />
            <QuickLink to='/package' icon={Package} label='npm Package' description='Install and use in Node.js/TypeScript' />
            <QuickLink to='/cli' icon={Terminal} label='CLI' description='Command-line lookups with npx or global install' />
            <QuickLink to='https://github.com/MetaPhase-Consulting/fedspeak' icon={FolderGit2} label='GitHub' description='Source code, issues, and contributions' external />
          </div>
        </div>

        {/* Overview */}
        <div className='mb-10'>
          <h2 className='text-xl font-bold text-slate-900 mb-4'>Overview</h2>
          <div className='prose prose-slate max-w-none'>
            <p className='text-slate-600 mb-4'>
              FedSpeak provides multiple ways to decode (and encode) U.S. government acronyms:
            </p>
            <ul className='space-y-2 text-slate-600'>
              <li className='flex items-start space-x-2'>
                <Globe className='w-4 h-4 text-blue-600 mt-1 shrink-0' />
                <span><strong>Website</strong> &mdash; Search with autocomplete, advanced filtering by category and agency, and text scanning</span>
              </li>
              <li className='flex items-start space-x-2'>
                <Code className='w-4 h-4 text-blue-600 mt-1 shrink-0' />
                <span><strong>REST API</strong> &mdash; GET and POST endpoints with JSON responses and CORS enabled for any integration</span>
              </li>
              <li className='flex items-start space-x-2'>
                <Package className='w-4 h-4 text-blue-600 mt-1 shrink-0' />
                <span><strong>npm Package</strong> &mdash; <code className='text-sm bg-slate-100 px-1.5 py-0.5 rounded text-blue-700'>npm install fedspeak</code> for use in Node.js and TypeScript projects</span>
              </li>
              <li className='flex items-start space-x-2'>
                <Terminal className='w-4 h-4 text-blue-600 mt-1 shrink-0' />
                <span><strong>CLI</strong> &mdash; <code className='text-sm bg-slate-100 px-1.5 py-0.5 rounded text-blue-700'>npx fedspeak DOD</code> for quick command-line lookups</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Getting Started */}
        <div className='mb-10'>
          <h2 className='text-xl font-bold text-slate-900 mb-4'>Getting Started</h2>
          <div className='space-y-6'>
            <div>
              <h3 className='text-base font-semibold text-slate-800 mb-2'>REST API</h3>
              <p className='text-sm text-slate-600 mb-3'>
                No authentication required. Send a POST or GET request to decode acronyms.
              </p>
              <CodeBlock>{`# Single lookup
curl "https://fedspeak.dev/api/decode?acronym=GSA"

# Scan text for all acronyms
curl -X POST https://fedspeak.dev/api/decode \\
  -H "Content-Type: application/json" \\
  -d '{"text": "The DOD and OMB released the new RFP"}'

# Reverse lookup (full name to acronym)
curl -X POST https://fedspeak.dev/api/encode \\
  -H "Content-Type: application/json" \\
  -d '{"name": "General Services Administration"}'`}</CodeBlock>
              <p className='text-sm text-slate-500 mt-2'>
                See the full <Link to='/api' className='text-blue-600 hover:underline'>API Reference</Link> for interactive docs.
              </p>
            </div>

            <div>
              <h3 className='text-base font-semibold text-slate-800 mb-2'>npm Package</h3>
              <CodeBlock>{`npm install fedspeak

import { lookupAcronym, decode, encode } from 'fedspeak';

const result = lookupAcronym('DOD');
console.log(result?.full); // "Department of Defense"

const response = decode({ text: 'The GSA and OMB are collaborating' });
console.log(response.count); // 2`}</CodeBlock>
              <p className='text-sm text-slate-500 mt-2'>
                See the <Link to='/package' className='text-blue-600 hover:underline'>Package</Link> page for all exports and TypeScript types.
              </p>
            </div>

            <div>
              <h3 className='text-base font-semibold text-slate-800 mb-2'>CLI</h3>
              <CodeBlock>{`# Run without installing
npx fedspeak DOD

# Look up multiple acronyms
npx fedspeak DOD OMB CISA`}</CodeBlock>
              <p className='text-sm text-slate-500 mt-2'>
                See the <Link to='/cli' className='text-blue-600 hover:underline'>CLI</Link> page for more examples.
              </p>
            </div>
          </div>
        </div>

        {/* Data */}
        <div className='mb-10'>
          <h2 className='text-xl font-bold text-slate-900 mb-4'>Data</h2>
          <p className='text-slate-600 mb-4'>
            The database includes over 1,000 U.S. government acronyms spanning departments, agencies, offices, bureaus, programs, regulations, and systems. Each entry includes:
          </p>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm border border-slate-200 rounded-lg overflow-hidden'>
              <thead className='bg-slate-100'>
                <tr>
                  <th className='text-left px-4 py-3 font-semibold text-slate-700'>Field</th>
                  <th className='text-left px-4 py-3 font-semibold text-slate-700'>Description</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-200'>
                {[
                  ['acronym', 'The acronym (e.g., GSA, DOD, OMB)'],
                  ['full', 'Full name or expansion'],
                  ['description', 'Brief description of what it is or does'],
                  ['agency', 'Parent agency or department'],
                  ['category', 'Classification (department, agency, office, bureau, program, etc.)'],
                  ['url', 'Official website (when available)'],
                  ['aliases', 'Alternate spellings or variations (when applicable)'],
                ].map(([field, desc]) => (
                  <tr key={field} className='hover:bg-slate-50'>
                    <td className='px-4 py-3 font-mono text-blue-700 text-xs whitespace-nowrap'>{field}</td>
                    <td className='px-4 py-3 text-slate-600'>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className='text-sm text-slate-500 mt-3'>
            Categories include: <code className='text-xs bg-slate-100 px-1.5 py-0.5 rounded'>department</code>{' '}
            <code className='text-xs bg-slate-100 px-1.5 py-0.5 rounded'>agency</code>{' '}
            <code className='text-xs bg-slate-100 px-1.5 py-0.5 rounded'>office</code>{' '}
            <code className='text-xs bg-slate-100 px-1.5 py-0.5 rounded'>bureau</code>{' '}
            <code className='text-xs bg-slate-100 px-1.5 py-0.5 rounded'>program</code>{' '}
            <code className='text-xs bg-slate-100 px-1.5 py-0.5 rounded'>process</code>{' '}
            <code className='text-xs bg-slate-100 px-1.5 py-0.5 rounded'>regulation</code>{' '}
            <code className='text-xs bg-slate-100 px-1.5 py-0.5 rounded'>system</code>{' '}
            <code className='text-xs bg-slate-100 px-1.5 py-0.5 rounded'>general</code>
          </p>
        </div>

        {/* Tech Stack */}
        <div className='mb-10'>
          <h2 className='text-xl font-bold text-slate-900 mb-4'>Tech Stack</h2>
          <div className='grid sm:grid-cols-2 gap-3'>
            {[
              { label: 'Frontend', value: 'React 18 + Vite + Tailwind CSS' },
              { label: 'API', value: 'Netlify Functions v2 (serverless)' },
              { label: 'Language', value: 'TypeScript 5.5 (strict mode)' },
              { label: 'Testing', value: 'Vitest with v8 coverage' },
              { label: 'Hosting', value: 'Netlify (fedspeak.dev)' },
              { label: 'CI/CD', value: 'GitHub Actions' },
            ].map(({ label, value }) => (
              <div key={label} className='flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-200'>
                <span className='text-sm font-medium text-slate-700 shrink-0'>{label}</span>
                <span className='text-sm text-slate-500'>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contributing */}
        <div className='bg-slate-50 border border-slate-200 rounded-lg p-6'>
          <h2 className='text-lg font-bold text-slate-900 mb-3'>Contributing</h2>
          <p className='text-sm text-slate-600 mb-4'>
            FedSpeak is open source. Contributions are welcome &mdash; whether adding new acronyms, fixing bugs, or improving documentation.
          </p>
          <CodeBlock>{`git clone https://github.com/MetaPhase-Consulting/fedspeak.git
cd fedspeak
npm install
npm run dev`}</CodeBlock>
          <p className='text-sm text-slate-500 mt-4'>
            Development server runs at <code className='text-xs bg-slate-100 px-1.5 py-0.5 rounded'>localhost:8888</code> with hot reload and Netlify Functions.
          </p>
          <div className='flex flex-wrap gap-3 mt-4'>
            <a
              href='https://github.com/MetaPhase-Consulting/fedspeak'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-800'
            >
              <FolderGit2 className='w-4 h-4' />
              <span>View on GitHub</span>
            </a>
            <a
              href='https://www.npmjs.com/package/fedspeak'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-800'
            >
              <Package className='w-4 h-4' />
              <span>View on npm</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
