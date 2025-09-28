'use client'

import React, { KeyboardEvent, MouseEvent } from 'react'
import type { FeaturedProjectsBlock, Project, ProjectCategory } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { useAnimatedNavigation } from '@/page-transition/transition-provider'

type Props = FeaturedProjectsBlock

// --- helpers copied from your CMSLink behavior (trimmed) ---
function isExternalHref(href: string) {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/|mailto:|tel:)/i.test(href)
}
function isHashHref(href: string) {
  return href.startsWith('#')
}
function isInternalNavigable(href: string, newTab?: boolean | null) {
  if (newTab) return false
  if (!href) return false
  if (isHashHref(href)) return false
  if (isExternalHref(href)) return false
  return true
}

// Derive the card href from the project's first link; fallback to its detail page
function getProjectHref(p: Project): { href: string; newTab?: boolean | null } {
  const l = p.links?.[0]?.link as any
  if (l) {
    if (l.type === 'custom' && l.url) return { href: l.url, newTab: l.newTab }
    if (l.type === 'reference' && l.reference?.value) {
      const rel = l.reference.relationTo
      const doc: any = l.reference.value
      const slug = doc?.slug
      if (slug) return { href: `${rel !== 'pages' ? `/${rel}` : ''}/${slug}`, newTab: l.newTab }
    }
  }
  return { href: `/projects/${p.slug}` }
}

export const FeaturedProjectsBlockComponent: React.FC<Props> = ({ title, projects, cta }) => {
  const items = (projects ?? [])
    .map((p) => (typeof p === 'object' && p !== null ? (p as Project) : null))
    .filter(Boolean) as Project[]

  const ctaLink = cta?.[0]?.link
  const nav = useAnimatedNavigation()

  if (!items.length) return null

  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-darkSky" id="featured-projects">
      <div className="container">
        {title ? (
          <h2 className="text-center font-anton text-white text-4xl sm:text-6xl md:text-10xl mb-10 sm:mb-12 md:mb-20">
            {title}
          </h2>
        ) : null}

        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2">
          {items.map((p) => {
            const { href, newTab } = getProjectHref(p)

            const onCardClick = (e: MouseEvent<HTMLElement>) => {
              // If user actually clicked an <a> inside (e.g., the CTA), don't double-navigate
              const target = e.target as Element
              if (target.closest('a')) return

              if (isInternalNavigable(href, newTab)) {
                e.preventDefault()
                nav?.onNavigate?.(href) // transition-aware navigation
                return
              }

              if (newTab) {
                window.open(href, '_blank', 'noopener,noreferrer')
              } else {
                window.location.assign(href)
              }
            }

            const onCardKeyDown = (e: KeyboardEvent<HTMLElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                // mirror click behavior for keyboard users
                if (isInternalNavigable(href, newTab)) {
                  nav?.onNavigate?.(href)
                } else if (newTab) {
                  window.open(href, '_blank', 'noopener,noreferrer')
                } else {
                  window.location.assign(href)
                }
              }
            }

            return (
              <article
                key={p.id}
                role="link"
                aria-label={(p.header as string) || 'View project'}
                tabIndex={0}
                onClick={onCardClick}
                onKeyDown={onCardKeyDown}
                className="
                  group cursor-pointer rounded-2xl border bg-white overflow-hidden
                  transition-shadow duration-300 hover:shadow-lg focus:outline-none
                  focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-darkSky
                "
              >
                {/* Media */}
                <div className="relative p-2">
                  {/* clipper (no padding) */}
                  <div className="overflow-hidden rounded-[14px]">
                    <Media
                      resource={p.image}
                      alt={(p.header as string) || 'Project image'}
                      className="block"
                      imgClassName="
        w-full aspect-[4/3] object-cover
        transition-transform duration-500 ease-out will-change-transform transform-gpu
        group-hover:scale-[1.1]
        /* no rounded on the img */
      "
                      priority={false}
                    />
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 md:p-6">
                  <h3 className="font-anton text-xl md:text-2xl text-darkGray mb-2">{p.header}</h3>

                  {p.description ? (
                    <p className="text-base md:text-md text-muted-foreground mb-6">
                      {p.description}
                    </p>
                  ) : null}

                  {/* Chips */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(p.projectCategories ?? [])
                      .map((c) => (typeof c === 'object' && c ? (c as ProjectCategory) : null))
                      .filter(Boolean)
                      .map((c) => (
                        <span
                          key={c!.id}
                          className="inline-flex items-center rounded-full bg-eggshell px-2.5 py-1 text-sm font-semibold text-darkGray"
                        >
                          {c!.title as string}
                        </span>
                      ))}
                  </div>

                  {/* CTA (still clickable; card click ignores it via closest('a') guard) */}
                  <div className="pt-1">
                    <CMSLink
                      {...(p.links?.[0]?.link ?? {
                        type: 'custom',
                        url: `/projects/${p.slug}`,
                        label: 'View project',
                        appearance: 'chevronRight',
                      })}
                      appearance={p.links?.[0]?.link?.appearance ?? 'chevronRight'}
                      className="text-sm"
                    />
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {ctaLink ? (
          <div className="mt-10 sm:mt-12 md:mt-20 flex justify-center">
            <CMSLink
              {...ctaLink}
              appearance={ctaLink.appearance ?? 'outline'}
              className="bg-transparent text-white"
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default FeaturedProjectsBlockComponent
