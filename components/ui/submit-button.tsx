'use client'

import { useFormStatus } from 'react-dom'
import { Button } from './button'
import { Loader2 } from 'lucide-react'
import { ButtonProps } from './button'

interface SubmitButtonProps extends ButtonProps {
  label?: string
  loadingLabel?: string
}

export function SubmitButton({ 
  label = 'Submit', 
  loadingLabel = 'Submitting...',
  className,
  ...props 
}: SubmitButtonProps) {
  const { pending } = useFormStatus()
  
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className={className}
      {...props}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingLabel}
        </>
      ) : label}
    </Button>
  )
}
