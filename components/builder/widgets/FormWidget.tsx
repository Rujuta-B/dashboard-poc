import { FormConfig } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface FormWidgetProps {
  config: FormConfig
}

export function FormWidget({ config }: FormWidgetProps) {
  const fields = config.fields.length > 0 ? config.fields : [
    {
      name: 'name',
      label: 'Name',
      type: 'text' as const,
      validation: { required: true }
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email' as const,
      validation: { required: true }
    }
  ]

  return (
    <div className="w-full h-full overflow-auto">
      <form className="space-y-4 p-2">
        {fields.map(field => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
              {field.validation.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {field.type === 'select' ? (
              <select 
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                aria-label={field.label}
                title={field.label}
              >
                <option value="">Select an option</option>
                {field.options?.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea 
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                rows={3}
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            ) : (
              <Input
                type={field.type}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className="text-sm"
              />
            )}
          </div>
        ))}
        
        <Button type="submit" className="w-full mt-4">
          Submit
        </Button>
      </form>
    </div>
  )
}