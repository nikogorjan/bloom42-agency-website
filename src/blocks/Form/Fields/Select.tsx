// src/blocks/FormBlock/fields/Select.tsx
import * as React from 'react'
import type { FieldErrors } from 'react-hook-form'

type Option = { label: string; value: string }
type Props = {
  name: string
  label?: string
  required?: boolean
  placeholder?: string
  options?: Option[]
  register: any
  errors: FieldErrors
}

export const Select: React.FC<Props> = ({
  name,
  label,
  required,
  placeholder,
  options = [],
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
      <select
        id={name}
        aria-invalid={invalid}
        className="select-base"
        defaultValue=""
        {...register(name, { required })}
      >
        <option value="" disabled hidden>
          {placeholder || 'Select…'}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {invalid && <p className="mt-1 text-sm text-coral">This field is required.</p>}
    </div>
  )
}
