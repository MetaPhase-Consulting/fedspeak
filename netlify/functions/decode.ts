import { decode } from '../../src/shared/decoder';
import { truncateResponse } from '../../src/shared/truncate';
import type { DecodeRequest } from '../../src/shared/types';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

function jsonResponse(body: object, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: CORS_HEADERS,
  });
}

async function parseRequest(request: Request): Promise<DecodeRequest> {
  if (request.method === 'GET') {
    const url = new URL(request.url);
    const acronym = url.searchParams.get('acronym');
    const text = url.searchParams.get('text');
    return {
      ...(acronym && { acronym }),
      ...(text && { text }),
    };
  }

  if (request.method === 'POST') {
    const body = await request.json();
    return {
      ...(body.acronym && { acronym: body.acronym }),
      ...(body.text && { text: body.text }),
    };
  }

  return {};
}

export default async function handler(
  request: Request
): Promise<Response> {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  try {
    if (request.method !== 'GET' && request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    const params = await parseRequest(request);

    if (!params.acronym && !params.text) {
      return jsonResponse(
        {
          error:
            'Missing required parameter. Provide "acronym" for single lookup or "text" for scanning.',
          usage: {
            single: { acronym: 'GSA' },
            scan: { text: 'The DOW and GSA are working with OMB' },
          },
        },
        400
      );
    }

    const result = decode(params);
    const truncated = truncateResponse(result);

    return jsonResponse(truncated);
  } catch {
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}
