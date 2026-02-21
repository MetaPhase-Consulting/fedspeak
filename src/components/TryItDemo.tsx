import { useState } from 'react';
import { Search, FileText } from 'lucide-react';
import { decode } from '../shared/decoder';
import type { DecodeResponse } from '../shared/types';

export default function TryItDemo() {
  const [mode, setMode] = useState<'single' | 'scan'>('single');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<DecodeResponse | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const response = decode(
      mode === 'single' ? { acronym: input } : { text: input }
    );
    setResult(response);
  }

  return (
    <section id='try-it' className='py-16 bg-white'>
      <div className='container mx-auto px-6 max-w-3xl'>
        <h2 className='text-3xl font-bold text-slate-900 text-center mb-8'>
          Try It
        </h2>

        <div className='flex justify-center space-x-2 mb-6'>
          <button
            onClick={() => {
              setMode('single');
              setResult(null);
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'single'
                ? 'bg-blue-700 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Search className='w-4 h-4' />
            <span>Single Lookup</span>
          </button>
          <button
            onClick={() => {
              setMode('scan');
              setResult(null);
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'scan'
                ? 'bg-blue-700 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className='w-4 h-4' />
            <span>Text Scan</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {mode === 'single' ? (
            <input
              type='text'
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder='Enter an acronym (e.g., GSA, DOW, OMB)'
              className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg'
            />
          ) : (
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder='Paste text with acronyms (e.g., "The DOW and GSA are working with OMB on the new RFP")'
              rows={4}
              className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
            />
          )}
          <button
            type='submit'
            className='w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors'
          >
            Decode
          </button>
        </form>

        {result && (
          <div className='mt-8 bg-slate-50 rounded-lg p-6 border border-slate-200'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-semibold text-slate-900'>
                {result.success
                  ? `Found ${result.count} result${result.count !== 1 ? 's' : ''}`
                  : 'No results found'}
              </h3>
              <span className='text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded'>
                {result.mode}
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
                    <span className='font-semibold text-slate-900'>
                      {r.full}
                    </span>
                  </div>
                  <span className='text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded'>
                    {r.category}
                  </span>
                </div>
                <p className='text-sm text-slate-600 mt-1 ml-0'>
                  {r.description}
                </p>
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
