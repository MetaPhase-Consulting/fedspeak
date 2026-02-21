import { encode } from '../../src/shared/encoder';
import { truncateResponse } from '../../src/shared/truncate';
import type { EncodeRequest } from '../../src/shared/types';

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

async function parseRequest(request: Request): Promise<EncodeRequest> {
  if (request.method === 'GET') {
    const url = new URL(request.url);
    const name = url.searchParams.get('name');
    const text = url.searchParams.get('text');
    return {
      ...(name && { name }),
      ...(text && { text }),
    };
  }

  if (request.method === 'POST') {
    const body = await request.json();
    return {
      ...(body.name && { name: body.name }),
      ...(body.text && { text: body.text }),
    };
  }

  return {};
}

export default async function handler(
  request: Request
): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  try {
    if (request.method !== 'GET' && request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    const params = await parseRequest(request);

    if (!params.name && !params.text) {
      return jsonResponse(
        {
          error:
            'Missing required parameter. Provide "name" for single lookup or "text" for scanning.',
          usage: {
            single: { name: 'General Services Administration' },
            scan: { text: 'The General Services Administration works with the Office of Management and Budget' },
          },
        },
        400
      );
    }

    const result = encode(params);
    const truncated = truncateResponse(result);

    return jsonResponse(truncated);
  } catch {
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}
