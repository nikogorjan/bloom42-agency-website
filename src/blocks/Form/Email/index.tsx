// src/blocks/FormBlock/fields/Email.tsx
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

export const Email: React.FC<Props> = ({
  name,
  label,
  required,
  placeholder,
  register,
  errors,
}) => {
  const invalid = Boolean(errors?.[name])
  return (
    <div>
      {label && (
        <label htmlFor={name} className={`label-base ${required ? 'label-required' : ''}`}>
          {label}
        </label>
      )}
      <input
        id={name}
        type="email"
        aria-invalid={invalid}
        placeholder={placeholder}
        className="input-base rounded-md"
        {...register(name, {
          required,
          pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
        })}
      />
      {invalid && (
        <p className="mt-1 text-sm text-coral">
          {(errors?.[name]?.message as string) || 'This field is required.'}
        </p>
      )}
    </div>
  )
}
