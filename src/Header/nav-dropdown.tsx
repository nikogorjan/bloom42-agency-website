// components/NavDropdown.tsx
'use client'

import React, { useState } from 'react'
import { RxChevronDown } from 'react-icons/rx'
import { Media } from '@/components/Media'
import { TransitionLink } from '@/page-transition/transition-link'

interface NavDropdownProps {
  item: any
}

export const NavDropdown: React.FC<NavDropdownProps> = ({ item }) => {
  const [preview, setPreview] = useState(item?.defaultImage)
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        setPreview(item?.defaultImage)
        setOpen(false)
      }}
    >
      <button
        type="button"
        className="flex h-10 items-center px-2 text-sm"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {item?.label}
        <RxChevronDown
          className={`ml-1 h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* hover bridge so moving from button to panel doesn't close it */}
      <span className="pointer-events-auto absolute inset-x-0 top-full h-2 opacity-0" />

      <div
        className={`
          fixed left-1/2 top-[4.5rem] z-20 w-[992px] -translate-x-1/2 rounded p-3 shadow-lg
          transition-all duration-200 ease-out
          ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
        `}
      >
        <div
          className="flex items-start gap-3 bg-white p-3 rounded-lg border-2 border-lightGray"
          onMouseLeave={() => setPreview(item?.defaultImage)}
        >
          {/* LEFT: items */}
          <div className="w-full">
            {item?.items?.map((sub: any, j: number) => {
              const href =
                sub?.type === 'reference' && sub?.reference
                  ? `/${sub.reference.relationTo !== 'pages' ? sub.reference.relationTo : ''}/${(sub.reference.value as any).slug}`
                  : sub?.url || '#'

              const newTabProps = sub?.newTab
                ? ({ target: '_blank', rel: 'noopener noreferrer' } as const)
                : ({} as const)

              return (
                <TransitionLink
                  key={j}
                  href={href}
                  onMouseEnter={() => setPreview(sub?.media || item?.defaultImage)}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-5 px-2 py-2 hover:bg-gray-50 rounded border border-white hover:border-lightGray"
                  {...newTabProps}
                >
                  {/* icon */}
                  <div className="relative size-[55px] flex-shrink-0 flex items-center justify-center overflow-hidden bg-lightGray rounded-sm">
                    <div className="relative size-[24px]">
                      <Media
                        resource={sub?.icon}
                        alt={sub?.icon?.alt}
                        fill
                        imgClassName="object-contain"
                        priority
                      />
                    </div>
                  </div>

                  {/* text + arrow */}
                  <div className="flex justify-between gap-20 w-full">
                    <div className="flex flex-col w-full">
                      <h6 className="text-sm leading-snug">{sub?.label}</h6>
                      {sub?.description && (
                        <p className="text-xs text-gray-600">{sub.description}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-end">
                      <div className="relative size-[14px]">
                        <Media
                          src="/media/icons/right-arrow-alt.svg"
                          alt="arrow"
                          fill
                          priority
                          imgClassName="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </TransitionLink>
              )
            })}
          </div>

          {/* divider */}
          <div className="self-stretch w-px bg-lightGray flex-shrink-0 ml-2 my-2" />

          {/* RIGHT: preview */}
          <div className="relative w-96 aspect-[16/11] flex-shrink-0 overflow-hidden rounded m-2">
            <Media resource={preview} alt="" fill imgClassName="object-cover" priority />
          </div>
        </div>
      </div>
    </div>
  )
}
