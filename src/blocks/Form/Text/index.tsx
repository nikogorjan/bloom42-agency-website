// src/blocks/FormBlock/fields/Text.tsx
import { cn } from '@/utilities/ui'
import * as React from 'react'
import type { FieldErrors } from 'react-hook-form'

type Props = {
  name: string
  label?: string
  required?: boolean
  placeholder?: string
  register: any
  errors: FieldErrors
}

export const Text: React.FC<Props> = ({ name, label, required, placeholder, register, errors }) => {
  const invalid = Boolean(errors?.[name])
  return (
    <div>
      {label && (
        <label htmlFor={name} className={cn('label-base', required && 'label-required')}>
          {label}
        </label>
      )}
      <input
        id={name}
        type="text"
        aria-invalid={invalid}
        placeholder={placeholder}
        className="input-base rounded-md"
        {...register(name, { required })}
      />
      {invalid && <p className="mt-1 text-sm text-coral">This field is required.</p>}
    </div>
  )
}
