'use server'

import { generateObject } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'

// Initialize OpenAI provider
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Schema for AI-generated form
const FormFieldSchema = z.object({
  name: z.string().describe('Field name in camelCase'),
  label: z.string().describe('Human-readable label'),
  type: z.enum(['text', 'number', 'email', 'select', 'textarea', 'date', 'checkbox']),
  placeholder: z.string().optional(),
  validation: z.object({
    required: z.boolean().default(false),
    min: z.number().optional().describe('Minimum value for numbers or length for text'),
    max: z.number().optional().describe('Maximum value for numbers or length for text'),
    pattern: z.string().optional().describe('Regex pattern for validation')
  }),
  options: z.array(z.string()).optional().describe('Options for select fields'),
  defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional()
})

const GeneratedFormSchema = z.object({
  title: z.string().describe('Form title'),
  description: z.string().optional().describe('Form description'),
  fields: z.array(FormFieldSchema),
  submitButtonText: z.string().default('Submit')
})

export async function generateFormFromDescription(description: string) {
  try {
    const { object } = await generateObject({
      model: openai('gpt-4o') as any,
      mode: 'json',
      schema: GeneratedFormSchema,
      prompt: `You are a form designer. Generate a comprehensive form based on this description: "${description}". 
      
      Guidelines:
      - Include all necessary fields with appropriate types
      - Add sensible validation rules
      - Use clear, user-friendly labels
      - Add helpful placeholders
      - For select fields, provide relevant options
      - Consider UX best practices
      
      Return a well-structured form configuration.`
    })

    return {
      success: true,
      form: object
    }
  } catch (error) {
    console.error('Form generation error:', error)
    
    // Check for quota exceeded error
    if (error && typeof error === 'object' && 'message' in error) {
      const errorMessage = String(error.message)
      if (errorMessage.includes('quota') || errorMessage.includes('insufficient_quota')) {
        return {
          success: false,
          error: 'OpenAI API quota exceeded. Please check your billing details at https://platform.openai.com/account/billing'
        }
      }
    }
    
    return {
      success: false,
      error: 'Failed to generate form. Please try again.'
    }
  }
}

export async function generateFormFromSchema(
  tableName: string,
  columns: Array<{ name: string; type: string; nullable: boolean }>
) {
  try {
    const columnInfo = columns.map(col => 
      `${col.name} (${col.type}${col.nullable ? ', nullable' : ', required'})`
    ).join(', ')

    const { object } = await generateObject({
      model: openai('gpt-4o') as any,
      mode: 'json',
      schema: GeneratedFormSchema,
      prompt: `Generate a CRUD form for database table "${tableName}" with columns: ${columnInfo}.
      
      Guidelines:
      - Map database types to appropriate form field types (varchar → text, int → number, etc.)
      - Set required validation based on nullable constraint
      - Use snake_case column names but convert to readable labels
      - Add appropriate min/max constraints for numeric fields
      - For timestamp fields, use date type
      - For boolean fields, use checkbox type
      
      Return a production-ready form configuration.`
    })

    return {
      success: true,
      form: object
    }
  } catch (error) {
    console.error('Schema form generation error:', error)
    return {
      success: false,
      error: 'Failed to generate form from schema.'
    }
  }
}

export async function improveForm(
  currentForm: z.infer<typeof GeneratedFormSchema>,
  improvement: string
) {
  try {
    const { object } = await generateObject({
      model: openai('gpt-4o') as any,
      mode: 'json',
      schema: GeneratedFormSchema,
      prompt: `Improve this form based on the following request: "${improvement}"
      
      Current form:
      ${JSON.stringify(currentForm, null, 2)}
      
      Make the requested changes while maintaining form quality and UX best practices.`
    })

    return {
      success: true,
      form: object
    }
  } catch (error) {
    console.error('Form improvement error:', error)
    return {
      success: false,
      error: 'Failed to improve form.'
    }
  }
}

export type GeneratedForm = z.infer<typeof GeneratedFormSchema>
export type FormField = z.infer<typeof FormFieldSchema>

