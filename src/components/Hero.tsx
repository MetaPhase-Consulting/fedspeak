import { getAcronymCount } from '../shared/decoder';

export default function Hero() {
  const count = getAcronymCount();

  return (
    <section className='bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 text-white py-20'>
      <div className='container mx-auto px-6 text-center'>
        <h1 className='text-5xl font-bold mb-4'>FedSpeak</h1>
        <p className='text-xl text-blue-100 mb-2'>
          Federal Acronym Decoder
        </p>
        <p className='text-blue-200 mb-8 max-w-2xl mx-auto'>
          Decode {count}+ U.S. government acronyms instantly. Send a single acronym
          or paste a block of text — FedSpeak finds and expands them all.
        </p>
        <div className='flex justify-center space-x-4'>
          <a
            href='#try-it'
            className='bg-white text-blue-800 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors'
          >
            Try It Now
          </a>
          <a
            href='/docs'
            className='border border-blue-300 text-blue-100 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors'
          >
            API Docs
          </a>
        </div>
      </div>
    </section>
  );
}
