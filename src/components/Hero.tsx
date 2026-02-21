import { useState, useRef, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { getAcronymCount, getAllAcronyms, lookupAcronym } from '../shared/decoder';
import type { DecodedResult } from '../shared/types';

export default function Hero() {
  const count = getAcronymCount();
  const allAcronyms = useRef(getAllAcronyms());

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [result, setResult] = useState<DecodedResult | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectAcronym = useCallback((acronym: string) => {
    setQuery(acronym);
    setShowDropdown(false);
    setSuggestions([]);
    setHighlightIndex(-1);
    const found = lookupAcronym(acronym);
    setResult(found);
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    setResult(null);

    if (value.length >= 2) {
      const upper = value.toUpperCase();
      const matches = allAcronyms.current
        .filter(a => a.toUpperCase().startsWith(upper))
        .slice(0, 8);
      setSuggestions(matches);
      setShowDropdown(matches.length > 0);
      setHighlightIndex(-1);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setShowDropdown(false);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
        selectAcronym(suggestions[highlightIndex]);
      } else if (query.trim()) {
        selectAcronym(query.trim());
      }
    }
  }

  return (
    <section className='bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 text-white py-16 md:py-20'>
      <div className='container mx-auto px-6 text-center'>
        <h1 className='text-4xl md:text-5xl font-bold mb-4'>FedSpeak</h1>
        <p className='text-lg md:text-xl text-blue-100 mb-2'>Federal Acronym Decoder</p>
        <p className='text-blue-200 mb-8 max-w-2xl mx-auto'>
          Decode {count.toLocaleString()}+ U.S. government acronyms instantly.
        </p>

        {/* Search with autocomplete */}
        <div className='max-w-xl mx-auto' ref={wrapperRef}>
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
            <input
              ref={inputRef}
              type='text'
              value={query}
              onChange={e => handleChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
              placeholder={`Search ${count.toLocaleString()} acronyms...`}
              className='w-full pl-12 pr-4 py-4 rounded-xl text-lg text-slate-900 bg-white shadow-lg focus:ring-2 focus:ring-blue-300 outline-none'
              autoComplete='off'
            />

            {/* Autocomplete dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div className='absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50'>
                {suggestions.map((acronym, i) => {
                  const entry = lookupAcronym(acronym);
                  return (
                    <button
                      key={acronym}
                      onClick={() => selectAcronym(acronym)}
                      className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                        i === highlightIndex ? 'bg-blue-50' : 'hover:bg-slate-50'
                      } ${i > 0 ? 'border-t border-slate-100' : ''}`}
                    >
                      <div className='flex items-center space-x-3'>
                        <span className='text-sm font-mono font-bold text-blue-700'>{acronym}</span>
                        <span className='text-sm text-slate-600 truncate'>
                          {entry?.full}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Result card */}
          {result && (
            <div className='mt-6 bg-white rounded-xl shadow-lg p-6 text-left'>
              <div className='flex items-start justify-between mb-2'>
                <div>
                  <span className='inline-block bg-blue-100 text-blue-800 text-sm font-mono font-bold px-2 py-0.5 rounded mr-2'>
                    {result.acronym}
                  </span>
                  <span className='font-semibold text-slate-900'>{result.full}</span>
                </div>
                <span className='text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded'>
                  {result.category}
                </span>
              </div>
              <p className='text-sm text-slate-600 mt-2'>{result.description}</p>
              {result.url && (
                <a
                  href={result.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-xs text-blue-600 hover:underline mt-2 inline-block'
                >
                  {result.url}
                </a>
              )}
            </div>
          )}

          {/* No result message */}
          {query.trim().length >= 2 && result === null && !showDropdown && (
            <p className='mt-4 text-blue-200 text-sm'>
              No match found for &ldquo;{query}&rdquo;. Try another acronym.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
