import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { getAllEntries, getCategories, getAgencies, getAcronymCount } from '../shared/decoder';
import type { DecodedResult } from '../shared/types';

type SortField = 'acronym' | 'full' | 'agency' | 'category';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE_OPTIONS = [25, 50, 100] as const;

export default function SearchPage() {
  const allEntries = useMemo(() => getAllEntries(), []);
  const categories = useMemo(() => getCategories(), []);
  const agencies = useMemo(() => getAgencies(), []);
  const totalCount = getAcronymCount();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('');
  const [sortField, setSortField] = useState<SortField>('acronym');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const filtered = useMemo(() => {
    let results: DecodedResult[] = allEntries;

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      results = results.filter(
        r =>
          r.acronym.toLowerCase().includes(q) ||
          r.full.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      results = results.filter(r => r.category === selectedCategory);
    }

    if (selectedAgency) {
      results = results.filter(r => r.agency === selectedAgency);
    }

    results = [...results].sort((a, b) => {
      const aVal = a[sortField].toLowerCase();
      const bVal = b[sortField].toLowerCase();
      const cmp = aVal.localeCompare(bVal);
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return results;
  }, [allEntries, query, selectedCategory, selectedAgency, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const pageResults = filtered.slice(startIndex, startIndex + pageSize);

  const hasActiveFilters = selectedCategory || selectedAgency;

  function clearFilters() {
    setSelectedCategory('');
    setSelectedAgency('');
    setQuery('');
    setPage(1);
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    setPage(1);
  }

  function handleCategoryChange(value: string) {
    setSelectedCategory(value);
    setPage(1);
  }

  function handleAgencyChange(value: string) {
    setSelectedAgency(value);
    setPage(1);
  }

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    setPage(1);
  }

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(1);
  }

  function SortButton({ field, label }: { field: SortField; label: string }) {
    const active = sortField === field;
    return (
      <button
        onClick={() => toggleSort(field)}
        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
          active
            ? 'bg-blue-700 text-white border-blue-700'
            : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'
        }`}
      >
        {label} {active && (sortDir === 'asc' ? '\u2191' : '\u2193')}
      </button>
    );
  }

  function Pagination() {
    if (filtered.length <= pageSize) return null;

    const endIndex = Math.min(startIndex + pageSize, filtered.length);

    // Build page number buttons
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push('...');
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
        pages.push(i);
      }
      if (safePage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return (
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4 mt-6'>
        <div className='text-sm text-slate-500'>
          {startIndex + 1}&ndash;{endIndex} of {filtered.length.toLocaleString()}
        </div>

        <div className='flex items-center space-x-1'>
          <button
            onClick={() => setPage(1)}
            disabled={safePage === 1}
            className='p-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed'
            aria-label='First page'
          >
            <ChevronsLeft className='w-4 h-4' />
          </button>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className='p-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed'
            aria-label='Previous page'
          >
            <ChevronLeft className='w-4 h-4' />
          </button>

          {pages.map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className='px-2 text-slate-400 text-sm'>...</span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`min-w-[2rem] h-8 rounded border text-sm font-medium transition-colors ${
                  p === safePage
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className='p-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed'
            aria-label='Next page'
          >
            <ChevronRight className='w-4 h-4' />
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={safePage === totalPages}
            className='p-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed'
            aria-label='Last page'
          >
            <ChevronsRight className='w-4 h-4' />
          </button>
        </div>

        <div className='flex items-center space-x-2 text-sm text-slate-500'>
          <span>Per page:</span>
          {PAGE_SIZE_OPTIONS.map(size => (
            <button
              key={size}
              onClick={() => handlePageSizeChange(size)}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                pageSize === size
                  ? 'bg-blue-700 text-white'
                  : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className='py-12 md:py-16'>
      <div className='container mx-auto px-6 max-w-5xl'>
        <div className='flex items-center justify-center space-x-3 mb-4'>
          <Search className='w-8 h-8 text-blue-700' />
          <h1 className='text-3xl md:text-4xl font-bold text-slate-900'>Search</h1>
        </div>
        <p className='text-center text-slate-600 mb-8'>
          Browse and filter all {totalCount.toLocaleString()} acronyms in the database.
        </p>

        {/* Search input */}
        <div className='relative mb-4'>
          <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
          <input
            type='text'
            value={query}
            onChange={e => handleQueryChange(e.target.value)}
            placeholder='Search by acronym, full name, or description...'
            className='w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base'
            autoComplete='off'
          />
          {query && (
            <button
              onClick={() => handleQueryChange('')}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>

        {/* Filter toggle + sort */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6'>
          <div className='flex items-center space-x-2'>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 text-sm px-3 py-2 rounded-lg border transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'
              }`}
            >
              <SlidersHorizontal className='w-4 h-4' />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className='bg-blue-700 text-white text-xs px-1.5 py-0.5 rounded-full'>
                  {(selectedCategory ? 1 : 0) + (selectedAgency ? 1 : 0)}
                </span>
              )}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className='text-xs text-slate-500 hover:text-blue-700'
              >
                Clear all
              </button>
            )}
          </div>

          <div className='flex items-center space-x-2 flex-wrap gap-y-2'>
            <span className='text-xs text-slate-500'>Sort:</span>
            <SortButton field='acronym' label='Acronym' />
            <SortButton field='full' label='Name' />
            <SortButton field='category' label='Category' />
            <SortButton field='agency' label='Agency' />
          </div>
        </div>

        {/* Filter dropdowns */}
        {showFilters && (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg'>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>Category</label>
              <select
                value={selectedCategory}
                onChange={e => handleCategoryChange(e.target.value)}
                className='w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white'
              >
                <option value=''>All categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>Agency</label>
              <select
                value={selectedAgency}
                onChange={e => handleAgencyChange(e.target.value)}
                className='w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white'
              >
                <option value=''>All agencies</option>
                {agencies.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className='text-sm text-slate-500 mb-4'>
          Showing {filtered.length.toLocaleString()} of {totalCount.toLocaleString()} acronyms
        </div>

        {/* Results */}
        <div className='bg-white border border-slate-200 rounded-lg divide-y divide-slate-200'>
          {filtered.length === 0 ? (
            <div className='p-8 text-center text-slate-500'>
              No acronyms match your search. Try a different query or clear filters.
            </div>
          ) : (
            pageResults.map(r => (
              <div key={r.acronym} className='p-4 hover:bg-slate-50 transition-colors'>
                <div className='flex items-start justify-between gap-2'>
                  <div className='min-w-0'>
                    <div className='flex items-center flex-wrap gap-2 mb-1'>
                      <span className='inline-block bg-blue-100 text-blue-800 text-sm font-mono font-bold px-2 py-0.5 rounded'>
                        {r.acronym}
                      </span>
                      <span className='font-semibold text-slate-900'>{r.full}</span>
                    </div>
                    <p className='text-sm text-slate-600'>{r.description}</p>
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
                  <div className='flex flex-col items-end gap-1 shrink-0'>
                    <span className='text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded'>
                      {r.category}
                    </span>
                    <span className='text-xs text-slate-400'>
                      {r.agency}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <Pagination />
      </div>
    </section>
  );
}
