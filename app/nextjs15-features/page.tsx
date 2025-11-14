'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useActionState } from 'react';

// Demo action for Next.js 15 Form
async function submitDemoForm(prevState: { success: boolean; message: string; timestamp: string }, formData: FormData) {
  const name = formData.get('name');
  const email = formData.get('email');
  
  // Simulate processing
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    message: `Form submitted successfully! Name: ${name}, Email: ${email}`,
    timestamp: new Date().toISOString()
  };
}

export default function NextJS15FeaturesPage() {
  const [requestData, setRequestData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const [formState, formAction] = useActionState(submitDemoForm, { 
    success: false, 
    message: '',
    timestamp: ''
  });

  const fetchRequestData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/demo-request');
      const data = await response.json();
      setRequestData(data);
    } catch (error) {
      console.error('Error fetching request data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setTheme = async (theme: string) => {
    try {
      await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme })
      });
      alert(`Theme set to ${theme}`);
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Next.js 15 Features Demo</h1>
        <p className="text-gray-600 mb-8">
          Interactive demonstrations of Next.js 15 capabilities
        </p>

        <div className="grid gap-8">
          {/* Feature 1: Enhanced Forms */}
          <section className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">1. Enhanced Forms with next/form</h2>
            <p className="text-gray-600 mb-4">
              Next.js 15 introduces the <code className="bg-gray-100 px-2 py-1 rounded">next/form</code> component with enhanced prefetching and navigation.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Try it:</h3>
              <form action={formAction} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter your email"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Submit Form
                </button>
              </form>
              
              {formState.success && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800">{formState.message}</p>
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Code Example:</h4>
              <pre className="text-sm overflow-x-auto">
{`import Form from 'next/form';

<Form action="/search">
  <input name="query" />
  <button type="submit">Search</button>
</Form>

// Or use regular form with Server Actions
<form action={serverAction}>
  <input name="field" />
  <button type="submit">Submit</button>
</form>`}
              </pre>
            </div>
          </section>

          {/* Feature 2: Async Request APIs */}
          <section className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">2. Async Request APIs</h2>
            <p className="text-gray-600 mb-4">
              Next.js 15 makes request-specific APIs like cookies(), headers(), and params async for better optimization.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Try it:</h3>
              <div className="space-y-3">
                <button
                  onClick={fetchRequestData}
                  disabled={loading}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Fetch Request Data'}
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setTheme('dark')}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
                  >
                    Set Dark Theme
                  </button>
                  <button
                    onClick={() => setTheme('light')}
                    className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200"
                  >
                    Set Light Theme
                  </button>
                </div>
                
                {requestData && (
                  <div className="mt-4 p-4 bg-white border rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      {JSON.stringify(requestData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
              
              <Link
                href="/demo-async-params/example-123"
                className="inline-block mt-4 text-blue-600 hover:underline"
              >
                → View Async Params Demo Page
              </Link>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Code Example:</h4>
              <pre className="text-sm overflow-x-auto">
{`import { cookies, headers } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const headersList = await headers();
  
  const theme = cookieStore.get('theme');
  const userAgent = headersList.get('user-agent');
  
  return { theme, userAgent };
}`}
              </pre>
            </div>
          </section>

          {/* Feature 3: unstable_after API */}
          <section className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">3. unstable_after API</h2>
            <p className="text-gray-600 mb-4">
              Execute code after the response is sent to the user - perfect for analytics, logging, and cleanup tasks.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Implementation:</h3>
              <p className="text-sm text-gray-600 mb-2">
                When you create a new dashboard, analytics are logged AFTER the response is sent, so the user doesn't wait.
              </p>
              <Link
                href="/dashboards"
                className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Try Creating a Dashboard
              </Link>
              <p className="text-sm text-gray-500 mt-2">
                Check your terminal to see the analytics log after creating a dashboard!
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Code Example:</h4>
              <pre className="text-sm overflow-x-auto">
{`import { unstable_after as after } from 'next/server';

export async function createDashboard(data: FormData) {
  'use server';
  
  // Create the dashboard
  const dashboard = await db.insert(data);
  
  // Log analytics AFTER response is sent
  after(() => {
    console.log('[Analytics] Dashboard created:', {
      id: dashboard.id,
      timestamp: new Date()
    });
  });
  
  return dashboard;
}`}
              </pre>
            </div>
          </section>

          {/* Feature 4: Improved Caching */}
          <section className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">4. Improved Caching with staleTimes</h2>
            <p className="text-gray-600 mb-4">
              Next.js 15 introduces fine-grained control over caching behavior with <code className="bg-gray-100 px-2 py-1 rounded">staleTimes</code>.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Configuration:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Dynamic routes:</strong> Cached for 30 seconds</li>
                <li><strong>Static routes:</strong> Cached for 3 minutes</li>
                <li>Automatic revalidation on navigation</li>
                <li>Better performance with reduced server load</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">next.config.js:</h4>
              <pre className="text-sm overflow-x-auto">
{`experimental: {
  staleTimes: {
    dynamic: 30,  // 30 seconds for dynamic routes
    static: 180,  // 3 minutes for static routes
  },
}`}
              </pre>
            </div>
          </section>

          {/* Feature 5: Server Actions Security */}
          <section className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">5. Enhanced Server Actions Security</h2>
            <p className="text-gray-600 mb-4">
              Next.js 15 adds configurable security options for Server Actions.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Security Features:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Body Size Limit:</strong> Configurable request size limits (default: 1MB, set to 2MB)</li>
                <li><strong>Allowed Origins:</strong> Control which origins can call your Server Actions</li>
                <li><strong>CSRF Protection:</strong> Built-in protection against cross-site attacks</li>
                <li><strong>Rate Limiting:</strong> Prevent abuse with rate limiting</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">next.config.js:</h4>
              <pre className="text-sm overflow-x-auto">
{`serverActions: {
  bodySizeLimit: '2mb',
  allowedOrigins: ['localhost:3000'],
}`}
              </pre>
            </div>
          </section>

          {/* Feature 6: Turbopack */}
          <section className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">6. Turbopack (Beta)</h2>
            <p className="text-gray-600 mb-4">
              Turbopack is Next.js's new Rust-based bundler for faster development builds.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Performance Benefits:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>10x faster</strong> incremental builds</li>
                <li><strong>700x faster</strong> than Webpack for large applications</li>
                <li>Built in Rust for maximum performance</li>
                <li>Optimized Hot Module Replacement (HMR)</li>
              </ul>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This app is already running with Turbopack! The dev script uses <code className="bg-yellow-100 px-2 py-1 rounded">--turbo</code> flag.
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Usage:</h4>
              <pre className="text-sm overflow-x-auto">
{`// package.json
"scripts": {
  "dev": "next dev --turbo",
  "dev:webpack": "next dev"
}`}
              </pre>
            </div>
          </section>

          {/* Navigation */}
          <section className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-blue-200">
            <h2 className="text-2xl font-bold mb-4">Explore More</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/react19-features"
                className="block p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">React 19 Features →</h3>
                <p className="text-sm text-gray-600">
                  Explore React 19 hooks and capabilities
                </p>
              </Link>
              
              <Link
                href="/dashboards"
                className="block p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">Dashboard Builder →</h3>
                <p className="text-sm text-gray-600">
                  See all features in action
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
