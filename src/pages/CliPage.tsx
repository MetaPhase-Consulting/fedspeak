import { Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className='bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-sm'>
      <code>{children}</code>
    </pre>
  );
}

export default function CliPage() {
  return (
    <section className='py-12 md:py-16'>
      <div className='container mx-auto px-6 max-w-4xl'>
        <div className='flex items-center justify-center space-x-3 mb-4'>
          <Terminal className='w-8 h-8 text-blue-700' />
          <h1 className='text-3xl md:text-4xl font-bold text-slate-900'>CLI</h1>
        </div>
        <p className='text-center text-slate-600 mb-8 max-w-xl mx-auto'>
          Decode federal acronyms from the command line.
        </p>

        {/* Quick Start */}
        <div className='mb-10'>
          <h2 className='text-xl font-bold text-slate-900 mb-4'>Quick Start</h2>
          <CodeBlock>{`# Run without installing
npx fedspeak DOD

# Or install globally
npm install -g fedspeak
fedspeak DOD`}</CodeBlock>
        </div>

        {/* Single Lookup */}
        <div className='mb-10'>
          <h2 className='text-xl font-bold text-slate-900 mb-4'>Single Lookup</h2>
          <CodeBlock>{`$ fedspeak GSA

GSA — General Services Administration
  Federal agency managing government buildings, procurement, and technology solutions.
  Agency: GSA | Category: agency
  https://www.gsa.gov`}</CodeBlock>
        </div>

        {/* Multiple Lookups */}
        <div className='mb-10'>
          <h2 className='text-xl font-bold text-slate-900 mb-4'>Multiple Lookups</h2>
          <CodeBlock>{`$ fedspeak DOD OMB CISA

DOD — Department of Defense
  Executive branch department responsible for national security and the armed forces.

OMB — Office of Management and Budget
  EOP office overseeing federal budget, regulatory review, and management initiatives.

CISA — Cybersecurity and Infrastructure Security Agency
  DHS agency responsible for protecting critical infrastructure and federal networks.`}</CodeBlock>
        </div>

        {/* Programmatic Usage */}
        <div className='mb-10'>
          <h2 className='text-xl font-bold text-slate-900 mb-4'>Programmatic Usage</h2>
          <p className='text-slate-600 mb-4'>
            The CLI is powered by the same library available as an npm package.
            For programmatic usage in your projects, see the{' '}
            <Link to='/package' className='text-blue-600 hover:underline'>Package</Link> page.
          </p>
          <CodeBlock>{`import { lookupAcronym, decode } from 'fedspeak';

const result = lookupAcronym('DOD');
console.log(result?.full); // "Department of Defense"`}</CodeBlock>
        </div>

        {/* Install */}
        <div className='bg-slate-50 border border-slate-200 rounded-lg p-6'>
          <h2 className='text-lg font-bold text-slate-900 mb-3'>Installation</h2>
          <CodeBlock>{`npm install -g fedspeak
# or
npm install -g @metaphase-tech/fedspeak`}</CodeBlock>
          <p className='text-sm text-slate-500 mt-4'>
            Requires Node.js 18 or later.
          </p>
        </div>
      </div>
    </section>
  );
}
