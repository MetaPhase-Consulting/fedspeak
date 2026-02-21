import { useState } from 'react';
import { FileText } from 'lucide-react';
import { decode } from '../shared/decoder';
import type { DecodeResponse } from '../shared/types';

export default function TextScan() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<DecodeResponse | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setResult(decode({ text: input }));
  }

  return (
    <section className='py-12 md:py-16'>
      <div className='container mx-auto px-6 max-w-3xl'>
        <div className='flex items-center justify-center space-x-3 mb-4'>
          <FileText className='w-8 h-8 text-blue-700' />
          <h1 className='text-3xl md:text-4xl font-bold text-slate-900'>Text Scan</h1>
        </div>
        <p className='text-center text-slate-600 mb-8 max-w-xl mx-auto'>
          Paste a block of text and FedSpeak will find and decode every government acronym.
        </p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='Paste text with acronyms (e.g., "The DOD and GSA are working with OMB on the new RFP for a FedRAMP authorized system...")'
            rows={6}
            className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base'
          />
          <button
            type='submit'
            className='w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors'
          >
            Scan for Acronyms
          </button>
        </form>

        {result && (
          <div className='mt-8 bg-white rounded-lg p-6 border border-slate-200 shadow-sm'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='font-semibold text-slate-900'>
                {result.success
                  ? `Found ${result.count} acronym${result.count !== 1 ? 's' : ''}`
                  : 'No acronyms found'}
              </h2>
              <span className='text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded'>
                scan
              </span>
            </div>

            {result.results.map((r, i) => (
              <div
                key={i}
                className='border-b border-slate-200 last:border-0 py-3'
              >
                <div className='flex items-start justify-between'>
                  <div>
                    <span className='inline-block bg-blue-100 text-blue-800 text-sm font-mono font-bold px-2 py-0.5 rounded mr-2'>
                      {r.acronym}
                    </span>
                    <span className='font-semibold text-slate-900'>{r.full}</span>
                  </div>
                  <span className='text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded ml-2 shrink-0'>
                    {r.category}
                  </span>
                </div>
                <p className='text-sm text-slate-600 mt-1'>{r.description}</p>
                {r.url && (
                  <a
                    href={r.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-xs text-blue-600 hover:underline mt-1 inline-block'
                  >
                    {r.url}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
