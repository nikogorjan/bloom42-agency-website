// components/NavDropdown.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { RxChevronDown } from 'react-icons/rx'
import { Media } from '@/components/Media'

interface NavDropdownProps {
  item: any
}

export const NavDropdown: React.FC<NavDropdownProps> = ({ item }) => {
  const [preview, setPreview] = useState(item.defaultImage)
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        setPreview(item.defaultImage)
        setOpen(false)
      }}
    >
      <button className="flex h-10 items-center px-2 text-sm">
        {item.label}
        <RxChevronDown
          className={`ml-1 h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

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
          onMouseLeave={() => setPreview(item.defaultImage)}
        >
          <div className="w-full">
            {item.items?.map((sub: any, j: number) => {
              const href =
                sub.type === 'reference' && sub.reference
                  ? `/${sub.reference.relationTo !== 'pages' ? sub.reference.relationTo : ''}/${(sub.reference.value as any).slug}`
                  : sub.url

              return (
                <Link
                  key={j}
                  href={href || '#'}
                  onMouseEnter={() => setPreview(sub.media || item.defaultImage)}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-5 px-2 py-2 hover:bg-gray-50 rounded border border-white hover:border-lightGray"
                  {...(sub.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <div className="relative size-[55px] flex-shrink-0 flex items-center justify-center overflow-hidden bg-lightGray rounded-sm">
                    <div className="relative size-[24px]">
                      <Media
                        resource={sub.icon}
                        alt={sub.icon.alt}
                        fill
                        imgClassName="object-contain"
                        priority
                      />
                    </div>
                  </div>

                  <div className="flex justify-between gap-20 w-full">
                    <div className="flex flex-col w-full">
                      <h6 className="text-sm leading-snug">{sub.label}</h6>
                      <p className="text-xs text-gray-600">{sub.description}</p>
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
                </Link>
              )
            })}
          </div>

          <div className="self-stretch w-px bg-lightGray flex-shrink-0 ml-2" />

          <div className="relative w-96 aspect-[16/11] flex-shrink-0 overflow-hidden rounded">
            <Media resource={preview} alt="" fill imgClassName="object-cover" priority />
          </div>
        </div>
      </div>
    </div>
  )
}
