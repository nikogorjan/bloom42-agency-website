// src/blocks/FormBlock/Component.tsx
'use client'

import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import RichText from '@/components/RichText'
import { getClientSideURL } from '@/utilities/getURL'
import { fields } from './fields'
import type { ProjectCategory } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { RichTextCustom } from '@/components/common/rich-text/rich-text'
import { TRichText } from '@/components/common/rich-text/utils'
import Squares from '@/components/ui/squares-background-animation'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type ServiceItem = { id: string; title: string }

/**
 * RHF value shape: we keep our custom fields typed
 * and let the plugin's dynamic fields live alongside them.
 */
type FormValues = {
  serviceCategory: string
  serviceCategories: string[]
  // Allow other dynamic keys the plugin fields will set:
  [key: string]: any
}

type ContactItem = {
  icon?: any // Media doc
  label?: string | null
  value?: string | null
  type?: 'auto' | 'phone' | 'email' | 'link' | null
  url?: string | null
  id?: string | number
}

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'

  heading?: string | null
  description?: TRichText | null
  tagline?: string | null

  // 🔧 FIX: this must be an array
  contacts?: ContactItem[] | null

  formHeading?: string | null
  serviceLabel?: string | null

  enableIntro?: boolean
  introContent?: SerializedEditorState

  form: FormType

  serviceCategories?: (string | ProjectCategory)[] | null
  allowMultipleServices?: boolean
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export const FormBlock: React.FC<{ id?: string } & FormBlockType> = (props) => {
  const {
    heading,
    tagline,
    description,
    contacts = [],
    formHeading,
    enableIntro,
    introContent,
    serviceLabel,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},

    serviceCategories = [],
    allowMultipleServices = false,
  } = props

  // Normalize categories -> { id, title }
  const services: ServiceItem[] = useMemo(() => {
    return (serviceCategories || [])
      .map((c) => {
        if (c && typeof c === 'object' && 'id' in c) {
          return { id: String(c.id), title: (c as ProjectCategory).title as string }
        }
        return { id: String(c), title: String(c) }
      })
      .filter(Boolean)
  }, [serviceCategories])

  // RHF with explicit value shape and safe defaults
  const formMethods = useForm<FormValues>({
    defaultValues: {
      serviceCategory: '',
      serviceCategories: [],
    },
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    watch,
  } = formMethods

  // Typed watches (the `as const` narrows the keys for RHF)
  const selectedSingle = watch('serviceCategory' as const) ?? ''
  const selectedMulti = watch('serviceCategories' as const) ?? []

  const toggleService = (id: string) => {
    if (allowMultipleServices) {
      const next = new Set<string>(selectedMulti)

      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      setValue('serviceCategories', Array.from(next), { shouldDirty: true })
    } else {
      setValue('serviceCategory', id === selectedSingle ? '' : id, { shouldDirty: true })
    }
  }

  const isActive = (id: string) =>
    allowMultipleServices ? selectedMulti.includes(id) : selectedSingle === id

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: FormValues & { serviceCategory?: string; serviceCategories?: string[] }) => {
      let loadingTimerID: ReturnType<typeof setTimeout>

      const submitForm = async () => {
        setError(undefined)

        // RHF gives us the values directly; no need to rely on hidden inputs
        const dataToSend = Object.entries(data).map(([field, value]) => ({ field, value }))

        // delay loading indicator by 1s (optional UX nicety)
        loadingTimerID = setTimeout(() => setIsLoading(true), 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
          })

          const res = await req.json()
          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)
            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })
            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect?.url) {
            router.push(redirect.url)
          }
        } catch (err) {
          console.warn(err)
          clearTimeout(loadingTimerID)
          setIsLoading(false)
          setError({ message: 'Something went wrong.' })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  const [squareSize, setSquareSize] = useState(80)

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 768) {
        // Mobile
        setSquareSize(64)
      } else {
        // Tablet & up
        setSquareSize(80)
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const buildContactHref = (item: NonNullable<FormBlockType['contacts']>[number]) => {
    const raw = (item?.value || '').trim()
    const type = item?.type || 'auto'
    if (type === 'phone' || (type === 'auto' && /^\+?[0-9\s().-]+$/.test(raw))) {
      const cleaned = raw.replace(/[^\d+]/g, '')
      return `tel:${cleaned}`
    }
    if (type === 'email' || (type === 'auto' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw))) {
      return `mailto:${raw}`
    }
    if (type === 'link') {
      return item?.url?.trim() || raw
    }
    // fallback: if it looks like a URL, use it
    if (/^https?:\/\//i.test(raw)) return raw
    return '#'
  }

  return (
    <section className="bg-eggshell px-[5%] py-16 md:py-24 lg:py-28 relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Squares
          speed={0.1}
          squareSize={squareSize}
          direction="up"
          borderColor="#EBE9E4"
          hoverFillColor="#EBE9E4"
        />
      </div>
      <div className="relative container z-10">
        <div className="grid items-start gap-10 md:grid-cols-2 lg:gap-14">
          {/* LEFT: Heading + Description */}
          <div className="md:pr-6 lg:pr-10 h-full">
            <div className="h-full flex flex-col justify-between md:py-12">
              <div>
                {tagline ? (
                  <div className="flex items-center gap-3 text-sm leading-relaxed mb-6">
                    <BulletIcon className="md:h-6 md:w-6 2xl:h-8 2xl:w-8" />
                    <span className="text-2xl font-semibold text-darkGray">{tagline}</span>
                  </div>
                ) : null}
                {heading ? (
                  <h2 className="mb-5 text-6xl font-anton leading-tight text-darkGray md:mb-6 md:text-8xl lg:text-[72px]">
                    {heading}
                  </h2>
                ) : null}
              </div>
              <div>
                {description ? (
                  <RichTextCustom
                    text={description}
                    className="text-xl uppercase font-anton md:text-2xl text-darkSky"
                  />
                ) : null}
                {Array.isArray(contacts) && contacts.length > 0 ? (
                  <div className="mt-6 md:mt-8 inline-block w-auto rounded-xl bg-white p-2 shadow-sm">
                    <div className="flex flex-wrap gap-2">
                      {contacts.map((c, i) => {
                        const href = buildContactHref(c)
                        const isHttp = /^https?:\/\//i.test(href)

                        return (
                          <a
                            key={c?.id ?? i}
                            href={href}
                            {...(isHttp ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            className="flex items-center gap-3 rounded-lg bg-gray50 px-3 py-2 text-sm text-darkGray transition hover:bg-gray100"
                            aria-label={c?.label || c?.value || 'contact'}
                          >
                            {/* Icon circle */}
                            {c?.icon ? (
                              <span className="flex h-12 w-12 items-center justify-center rounded-lg">
                                <Media
                                  resource={c.icon as any}
                                  imgClassName="h-6 w-6 object-contain"
                                />
                              </span>
                            ) : null}
                          </a>
                        )
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            {enableIntro && introContent && !hasSubmitted && (
              <div className="mt-8 text-neutral-800">
                <RichText data={introContent} enableGutter={false} />
              </div>
            )}
          </div>

          {/* RIGHT: Form card */}
          <div className="md:pl-6 lg:pl-10">
            <div className="rounded-2xl border border-eggshell/40 bg-white p-5 shadow-lg shadow-neutral-400/50 md:p-6 lg:p-8">
              <FormProvider {...formMethods}>
                {!isLoading && hasSubmitted && confirmationType === 'message' && (
                  <RichText data={confirmationMessage} />
                )}

                {isLoading && !hasSubmitted && (
                  <p className="text-neutral-600">Loading, please wait...</p>
                )}

                {error && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {`${error.status || '500'}: ${error.message || ''}`}
                  </div>
                )}

                {formHeading ? (
                  <h3 className="mb-6 text-4xl font-anton text-darkGray md:text-8xl">
                    {formHeading}
                  </h3>
                ) : null}

                {!hasSubmitted && (
                  <form id={formID} onSubmit={handleSubmit(onSubmit)}>
                    {/* Services selector */}
                    {services.length > 0 && (
                      <fieldset className="mb-6">
                        {serviceLabel && (
                          <legend className="mb-4 block text-base font-medium text-neutral-700">
                            {serviceLabel}
                          </legend>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {services.map((svc) => {
                            const active = isActive(svc.id)
                            return (
                              <CMSLink
                                key={svc.id}
                                appearance="animatedInverted"
                                // use "#" to neutralize navigation; preventDefault in onClick:
                                type="custom"
                                url="#"
                                label={svc.title}
                                active={active} // keeps dark when selected
                                className="rounded-full"
                                onClick={(e) => {
                                  e.preventDefault()
                                  ;(e.currentTarget as HTMLAnchorElement).blur()
                                  toggleService(svc.id)
                                }}
                              />
                            )
                          })}
                        </div>
                      </fieldset>
                    )}

                    {/* Dynamic form fields from the plugin */}
                    <div className="mb-6 last:mb-0">
                      {formFromProps?.fields?.map((field, index) => {
                        const Field: React.FC<any> =
                          fields?.[field.blockType as keyof typeof fields]
                        if (!Field) return null
                        return (
                          <div className="mb-6 last:mb-0" key={index}>
                            <Field
                              form={formFromProps}
                              {...field}
                              {...formMethods}
                              control={control}
                              errors={errors}
                              register={register}
                            />
                          </div>
                        )
                      })}
                    </div>

                    <CMSLink
                      appearance="default"
                      type="custom"
                      url="#"
                      label={submitButtonLabel}
                      size="default"
                      className="w-full md:w-auto rounded-full"
                      onClick={(e) => {
                        e.preventDefault()
                        const formEl = document.getElementById(
                          formID as string,
                        ) as HTMLFormElement | null
                        formEl?.requestSubmit()
                      }}
                    />
                  </form>
                )}
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

type BulletIconProps = {
  className?: string
}

export function BulletIcon({ className }: BulletIconProps) {
  return (
    <span
      aria-hidden
      className={cn('relative inline-block h-12 w-12 shrink-0 mt-[2px]', className)}
    >
      <Media
        src="/images/bullets/bullet-orange.svg"
        alt=""
        fill
        imgClassName="object-contain"
        priority={false}
      />
    </span>
  )
}
