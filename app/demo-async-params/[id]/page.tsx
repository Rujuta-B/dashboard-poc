import { cookies, headers } from 'next/headers';
import { notFound } from 'next/navigation';

/**
 * Async params demonstration
 * In Next.js 15, route params are now accessed asynchronously
 */

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AsyncParamsDemo({ params }: PageProps) {
  // Async params
  const { id } = await params;
  
  // Validate the ID
  if (!id || id === 'invalid') {
    notFound();
  }
  
  // Async cookies() and headers()
  const cookieStore = await cookies();
  const headersList = await headers();
  
  const theme = cookieStore.get('theme')?.value || 'light';
  const userAgent = headersList.get('user-agent') || 'unknown';
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Next.js 15 Async Request APIs</h1>
      
      <div className="space-y-6">
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Async Params</h2>
          <p className="text-gray-600 mb-2">
            Route parameters are now accessed asynchronously for better performance.
          </p>
          <div className="bg-gray-100 p-4 rounded">
            <code className="text-sm">
              const &#123; id &#125; = await params;
            </code>
          </div>
          <p className="mt-4">
            <strong>Current ID:</strong> <span className="font-mono bg-blue-100 px-2 py-1 rounded">{id}</span>
          </p>
        </section>
        
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Async Cookies</h2>
          <p className="text-gray-600 mb-2">
            Access cookies asynchronously with better optimization.
          </p>
          <div className="bg-gray-100 p-4 rounded">
            <code className="text-sm">
              const cookieStore = await cookies();<br />
              const theme = cookieStore.get('theme');
            </code>
          </div>
          <p className="mt-4">
            <strong>Current Theme:</strong> <span className="font-mono bg-green-100 px-2 py-1 rounded">{theme}</span>
          </p>
        </section>
        
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Async Headers</h2>
          <p className="text-gray-600 mb-2">
            Access request headers asynchronously.
          </p>
          <div className="bg-gray-100 p-4 rounded">
            <code className="text-sm">
              const headersList = await headers();<br />
              const userAgent = headersList.get('user-agent');
            </code>
          </div>
          <p className="mt-4 text-sm break-all">
            <strong>User Agent:</strong> <span className="font-mono bg-purple-100 px-2 py-1 rounded">{userAgent}</span>
          </p>
        </section>
        
        <section className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold mb-2">Why Async?</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Better performance through streaming and partial prerendering</li>
            <li>Allows Next.js to optimize when these values are accessed</li>
            <li>Enables better caching strategies</li>
            <li>Improves server-side rendering performance</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  
  return {
    title: `Async Request Demo - ${id}`,
    description: 'Next.js 15 Async Request APIs demonstration',
  };
}
