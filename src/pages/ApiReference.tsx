import { useEffect, useRef } from 'react';

export default function ApiReference() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Swagger UI CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/swagger-ui-dist@5/swagger-ui.css';
    document.head.appendChild(link);

    // Load Swagger UI JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js';
    script.onload = () => {
      if (containerRef.current && window.SwaggerUIBundle) {
        window.SwaggerUIBundle({
          url: '/openapi.json',
          dom_id: '#swagger-ui',
          presets: [
            window.SwaggerUIBundle.presets.apis,
            window.SwaggerUIStandalonePreset,
          ],
          layout: 'BaseLayout',
          deepLinking: true,
          defaultModelsExpandDepth: 2,
          defaultModelExpandDepth: 2,
        });
      }
    };
    document.body.appendChild(script);

    // Load standalone preset
    const presetScript = document.createElement('script');
    presetScript.src = 'https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js';
    document.body.appendChild(presetScript);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
      document.body.removeChild(presetScript);
    };
  }, []);

  return (
    <div className='min-h-screen bg-white'>
      <div className='container mx-auto px-6 py-8'>
        <h1 className='text-3xl font-bold text-slate-900 mb-2'>API Reference</h1>
        <p className='text-slate-600 mb-8'>
          Interactive API documentation powered by OpenAPI 3.1 / Swagger UI.
          Try requests directly from this page.
        </p>
      </div>
      <div ref={containerRef} id='swagger-ui' />
    </div>
  );
}
