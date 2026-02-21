export default function ApiDocs() {
  return (
    <section className='py-16 bg-white'>
      <div className='container mx-auto px-6 max-w-4xl'>
        <h2 className='text-3xl font-bold text-slate-900 text-center mb-12'>
          API Reference
        </h2>

        <div className='space-y-8'>
          <div>
            <h3 className='text-lg font-semibold text-slate-900 mb-2'>
              Endpoint
            </h3>
            <code className='block bg-slate-800 text-green-400 p-4 rounded-lg text-sm'>
              POST https://fedspeak.dev/api/decode
            </code>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-slate-900 mb-4'>
              Mode 1: Single Lookup
            </h3>
            <div className='grid md:grid-cols-2 gap-4'>
              <div>
                <p className='text-sm font-medium text-slate-500 mb-2'>
                  Request
                </p>
                <pre className='bg-slate-800 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto'>
{`{
  "acronym": "GSA"
}`}
                </pre>
              </div>
              <div>
                <p className='text-sm font-medium text-slate-500 mb-2'>
                  Response
                </p>
                <pre className='bg-slate-800 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto'>
{`{
  "success": true,
  "query": "GSA",
  "mode": "single",
  "results": [{
    "acronym": "GSA",
    "full": "General Services Administration",
    "description": "...",
    "agency": "GSA",
    "category": "agency",
    "url": "https://www.gsa.gov"
  }],
  "count": 1,
  "truncated": false
}`}
                </pre>
              </div>
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-slate-900 mb-4'>
              Mode 2: Text Scan
            </h3>
            <div className='grid md:grid-cols-2 gap-4'>
              <div>
                <p className='text-sm font-medium text-slate-500 mb-2'>
                  Request
                </p>
                <pre className='bg-slate-800 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto'>
{`{
  "text": "The DOW and GSA are
  working with OMB on
  the new RFP"
}`}
                </pre>
              </div>
              <div>
                <p className='text-sm font-medium text-slate-500 mb-2'>
                  Response
                </p>
                <pre className='bg-slate-800 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto'>
{`{
  "success": true,
  "mode": "scan",
  "results": [
    { "acronym": "DOW", ... },
    { "acronym": "GSA", ... },
    { "acronym": "OMB", ... },
    { "acronym": "RFP", ... }
  ],
  "count": 4,
  "truncated": false
}`}
                </pre>
              </div>
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-slate-900 mb-4'>
              GET Support
            </h3>
            <code className='block bg-slate-800 text-green-400 p-4 rounded-lg text-sm'>
              GET https://fedspeak.dev/api/decode?acronym=GSA
            </code>
            <p className='text-sm text-slate-600 mt-2'>
              Also supports <code className='text-blue-700'>?text=...</code> for
              scan mode via query parameters.
            </p>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-slate-900 mb-4'>
              cURL Examples
            </h3>
            <pre className='bg-slate-800 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto'>
{`# Single lookup
curl -X POST https://fedspeak.dev/api/decode \\
  -H "Content-Type: application/json" \\
  -d '{"acronym": "GSA"}'

# Text scan
curl -X POST https://fedspeak.dev/api/decode \\
  -H "Content-Type: application/json" \\
  -d '{"text": "The DOW and GSA work with OMB"}'

# GET request
curl "https://fedspeak.dev/api/decode?acronym=GSA"`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
