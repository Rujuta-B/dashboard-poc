'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { generateFormFromDescription, type GeneratedForm, type FormField } from '@/app/actions/ai-form-generator';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Code, Eye } from 'lucide-react';

export function AIFormGenerator() {
  const [description, setDescription] = useState('');
  const [generatedForm, setGeneratedForm] = useState<GeneratedForm | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'preview' | 'json'>('preview');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('Please enter a form description');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await generateFormFromDescription(description);
      
      if (result.success && result.form) {
        setGeneratedForm(result.form);
      } else {
        setError(result.error || 'Failed to generate form');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderFormField = (field: FormField, index: number) => {
    const commonClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            key={index}
            name={field.name}
            placeholder={field.placeholder}
            required={field.validation?.required}
            className={`${commonClasses} min-h-[100px]`}
          />
        );
      
      case 'select':
        return (
          <select
            key={index}
            name={field.name}
            required={field.validation?.required}
            className={commonClasses}
            aria-label={field.label}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option, i) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <div key={index} className="flex items-center gap-2">
            <input
              type="checkbox"
              name={field.name}
              id={`field-${index}`}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={`field-${index}`} className="text-sm">
              {field.label}
            </label>
          </div>
        );
      
      default:
        return (
          <input
            key={index}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            required={field.validation?.required}
            min={field.validation?.min}
            max={field.validation?.max}
            pattern={field.validation?.pattern}
            className={commonClasses}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Generator Input */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          AI Form Generator
        </h2>
        <p className="text-gray-600 mb-4">
          Describe the form you need, and AI will generate it for you with proper validation and structure.
        </p>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Form Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., Create a contact form with name, email, phone, message, and a checkbox for newsletter subscription"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[120px]"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Form
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Generated Form Display */}
      {generatedForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Generated Form</h3>
            <div className="flex gap-2">
              <Button
                variant={view === 'preview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('preview')}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button
                variant={view === 'json' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('json')}
              >
                <Code className="mr-2 h-4 w-4" />
                JSON
              </Button>
            </div>
          </div>

          {view === 'preview' ? (
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <h4 className="text-2xl font-semibold mb-2">{generatedForm.title}</h4>
                  {generatedForm.description && (
                    <p className="text-gray-600 mb-4">{generatedForm.description}</p>
                  )}
                </div>

                {generatedForm.fields.map((field, index) => (
                  <div key={index} className="space-y-2">
                    {field.type !== 'checkbox' && (
                      <label htmlFor={field.name} className="block text-sm font-medium">
                        {field.label}
                        {field.validation?.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                    )}
                    {renderFormField(field, index)}
                    {field.validation?.min !== undefined && field.validation?.max !== undefined && (
                      <p className="text-xs text-gray-500">
                        {field.type === 'number' 
                          ? `Range: ${field.validation.min} - ${field.validation.max}`
                          : `Length: ${field.validation.min} - ${field.validation.max} characters`
                        }
                      </p>
                    )}
                  </div>
                ))}

                <Button type="submit" className="w-full">
                  {generatedForm.submitButtonText}
                </Button>
              </form>
            </div>
          ) : (
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                {JSON.stringify(generatedForm, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Example Prompts */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h4 className="font-semibold mb-3">Example Prompts to Try:</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <button
              onClick={() => setDescription("Create a job application form with full name, email, phone, resume upload, cover letter, years of experience, and desired position")}
              className="text-left hover:text-blue-600 transition-colors"
            >
              Job application form with validation
            </button>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <button
              onClick={() => setDescription("Create a product feedback form with product name, rating (1-5), comments, email, and would you recommend checkbox")}
              className="text-left hover:text-blue-600 transition-colors"
            >
              Product feedback form with rating
            </button>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <button
              onClick={() => setDescription("Create an event registration form with attendee name, email, phone, company, number of tickets, dietary restrictions, and special requests")}
              className="text-left hover:text-blue-600 transition-colors"
            >
              Event registration with multiple fields
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
