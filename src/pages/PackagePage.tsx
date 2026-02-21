import { Package } from 'lucide-react';

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className='bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-sm'>
      <code>{children}</code>
    </pre>
  );
}

export default function PackagePage() {
  return (
    <section className='py-12 md:py-16'>
      <div className='container mx-auto px-6 max-w-4xl'>
        <div className='flex items-center justify-center space-x-3 mb-4'>
          <Package className='w-8 h-8 text-blue-700' />
          <h1 className='text-3xl md:text-4xl font-bold text-slate-900'>Package</h1>
        </div>
        <p className='text-center text-slate-600 mb-8 max-w-xl mx-auto'>
          Use FedSpeak directly in your Node.js and TypeScript projects.
        </p>

        <div className='flex justify-center space-x-3 mb-10'>
          <a
            href='https://www.npmjs.com/package/fedspeak'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img
              src='https://img.shields.io/npm/v/fedspeak?label=npm&color=blue'
              alt='npm version'
              className='h-6'
            />
          </a>
        </div>

        {/* Installation */}
        <div className='mb-10'>
          <h2 className='text-xl font-bold text-slate-900 mb-4'>Installation</h2>
          <CodeBlock>{`npm install fedspeak
# or with the org scope
npm install @metaphase-tech/fedspeak`}</CodeBlock>
        </div>

        {/* Quick Usage */}
        <div className='mb-10'>
          <h2 className='text-xl font-bold text-slate-900 mb-4'>Quick Usage</h2>
          <CodeBlock>{`import { lookupAcronym, scanText, decode, encode, getAcronymCount } from 'fedspeak';

// Single acronym lookup
const result = lookupAcronym('DOD');
console.log(result?.full);
// "Department of Defense"

// Scan text for all acronyms
const found = scanText('The DOD and GSA are working with OMB');
found.forEach(r => console.log(\`\${r.acronym} = \${r.full}\`));

// Full decode with response envelope
const response = decode({ text: 'Submit the RFP to the CO at GSA' });
console.log(response.count); // 3

// Reverse lookup: full name to acronym
const encoded = encode({ name: 'General Services Administration' });
console.log(encoded.results[0].acronym); // "GSA"

// Get total count
console.log(getAcronymCount()); // 1069`}</CodeBlock>
        </div>

        {/* Exported Functions */}
        <div className='mb-10'>
          <h2 className='text-xl font-bold text-slate-900 mb-4'>Exported Functions</h2>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm border border-slate-200 rounded-lg overflow-hidden'>
              <thead className='bg-slate-100'>
                <tr>
                  <th className='text-left px-4 py-3 font-semibold text-slate-700'>Function</th>
                  <th className='text-left px-4 py-3 font-semibold text-slate-700'>Description</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-200'>
                {[
                  ['lookupAcronym(query)', 'Look up a single acronym. Returns result or null'],
                  ['scanText(text)', 'Scan text for all recognized acronyms'],
                  ['decode(request)', 'Full decode: { acronym } or { text }'],
                  ['lookupName(query)', 'Reverse lookup: full name to acronym'],
                  ['scanTextForNames(text)', 'Scan text for full names, return acronyms'],
                  ['encode(request)', 'Full encode: { name } or { text }'],
                  ['getAllAcronyms()', 'Get sorted array of all acronym keys'],
                  ['getAcronymCount()', 'Get total number of acronyms'],
                  ['truncateResponse(response)', 'Truncate response to fit 2000-char limit'],
                ].map(([fn, desc]) => (
                  <tr key={fn} className='hover:bg-slate-50'>
                    <td className='px-4 py-3 font-mono text-blue-700 text-xs whitespace-nowrap'>{fn}</td>
                    <td className='px-4 py-3 text-slate-600'>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TypeScript Types */}
        <div className='mb-10'>
          <h2 className='text-xl font-bold text-slate-900 mb-4'>TypeScript Types</h2>
          <CodeBlock>{`import type {
  AcronymCategory,  // 'department' | 'agency' | 'office' | ...
  AcronymEntry,     // { full, description, agency, category, url?, aliases? }
  AcronymData,      // Record of acronym key to AcronymEntry
  DecodedResult,    // Single decode result
  DecodeResponse,   // Full decode response envelope
  DecodeRequest,    // { acronym?: string; text?: string }
  EncodedResult,    // Single encode result
  EncodeResponse,   // Full encode response envelope
  EncodeRequest,    // { name?: string; text?: string }
} from 'fedspeak';`}</CodeBlock>
        </div>

        {/* Links */}
        <div className='bg-slate-50 border border-slate-200 rounded-lg p-6'>
          <h2 className='text-lg font-bold text-slate-900 mb-3'>Links</h2>
          <ul className='space-y-2 text-sm'>
            <li>
              <a href='https://www.npmjs.com/package/fedspeak' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>
                npmjs.com/package/fedspeak
              </a>
            </li>
            <li>
              <a href='https://www.npmjs.com/package/@metaphase-tech/fedspeak' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>
                npmjs.com/package/@metaphase-tech/fedspeak
              </a>
            </li>
            <li>
              <a href='https://github.com/MetaPhase-Consulting/fedspeak' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>
                GitHub Repository
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
