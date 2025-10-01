// src/blocks/FormBlock/fields/Textarea.tsx
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

export const Textarea: React.FC<Props> = ({
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
      <textarea
        id={name}
        aria-invalid={invalid}
        placeholder={placeholder}
        className="textarea-base rounded-md"
        {...register(name, { required })}
      />
      {invalid && <p className="mt-1 text-sm text-coral">This field is required.</p>}
    </div>
  )
}
