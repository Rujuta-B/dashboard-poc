import { AIFormGenerator } from '@/components/ai/AIFormGenerator';
import { Sparkles, Wand2, Zap, Shield, AlertCircle } from 'lucide-react';

export default function AIFormGeneratorPage() {
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* API Key Warning */}
        {!hasApiKey && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">OpenAI API Key Required</h3>
                <p className="text-sm text-yellow-800 mb-3">
                  To use the AI Form Generator, you need to add your OpenAI API key to <code className="bg-yellow-100 px-2 py-1 rounded">.env.local</code>
                </p>
                <div className="text-sm text-yellow-800 space-y-1">
                  <p><strong>Quick Setup:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com/api-keys</a></li>
                    <li>Create <code className="bg-yellow-100 px-1 rounded">.env.local</code> in project root</li>
                    <li>Add: <code className="bg-yellow-100 px-1 rounded">OPENAI_API_KEY=your-key-here</code></li>
                    <li>Restart the dev server</li>
                  </ol>
                  <p className="mt-3">
                    <a href="https://github.com/yourusername/dashboard-poc/blob/main/AI_SETUP_GUIDE.md" className="text-yellow-900 font-medium underline">
                      See full setup guide →
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">AI Form Generator</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Describe your form in plain English, and let AI create a fully functional, 
            validated form with proper field types and UX best practices.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Wand2 className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Field Detection</h3>
            <p className="text-gray-600 text-sm">
              AI automatically chooses the right field types (text, email, number, select, etc.) 
              based on your description.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Built-in Validation</h3>
            <p className="text-gray-600 text-sm">
              Forms come with sensible validation rules, required fields, min/max constraints, 
              and pattern matching.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Instant Preview</h3>
            <p className="text-gray-600 text-sm">
              See your generated form instantly with a live preview and exportable JSON schema.
            </p>
          </div>
        </div>

        {/* Main Generator */}
        <AIFormGenerator />

    
       
      </div>
    </div>
  );
}
