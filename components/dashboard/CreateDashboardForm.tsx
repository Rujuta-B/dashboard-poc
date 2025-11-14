'use client'

import { useActionState } from 'react'
import { createDashboard } from '@/app/actions/dashboard-demo'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/ui/submit-button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type FormState = {
  success: boolean
  error?: string
  dashboard?: {
    id: string
    name: string
  }
}

async function handleCreateDashboard(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  
  if (!name || name.trim().length === 0) {
    return {
      success: false,
      error: 'Please enter a dashboard name'
    }
  }
  
  const result = await createDashboard(name, description)
  
  if (result.success && result.dashboard) {
    return {
      success: true,
      dashboard: result.dashboard
    }
  }
  
  return {
    success: false,
    error: result.error || 'Failed to create dashboard'
  }
}

export function CreateDashboardForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(handleCreateDashboard, {
    success: false
  })
  
  useEffect(() => {
    if (state.success && state.dashboard) {
      router.push(`/dashboard/${state.dashboard.id}`)
    }
  }, [state.success, state.dashboard, router])
  
  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Dashboard Name *</Label>
        <Input
          id="name"
          name="name"
          placeholder="My Dashboard"
          required
          disabled={isPending}
          autoComplete="off"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Optional description"
          rows={3}
          disabled={isPending}
        />
      </div>
      
      {state.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      
      {state.success && state.dashboard && (
        <Alert className="bg-green-50 text-green-900 border-green-200">
          <AlertDescription>
            Dashboard created successfully! Redirecting...
          </AlertDescription>
        </Alert>
      )}
      
      <SubmitButton 
        label="Create Dashboard" 
        loadingLabel="Creating..."
        className="w-full"
      />
    </form>
  )
}
