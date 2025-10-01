// src/Footer/Component.tsx
import { getLocale } from 'next-intl/server'
import React from 'react'
import { CMSLink } from '@/components/Link'
import { TransitionLink } from '@/page-transition/transition-link'
import { getFooterCached } from '@/data/footer'
import type { Footer as FooterType } from '@/payload-types'
import { Media } from '@/components/Media'

// Social icons
import { FaXTwitter } from 'react-icons/fa6'
import {
  BiLogoFacebookCircle,
  BiLogoInstagram,
  BiLogoLinkedinSquare,
  BiLogoYoutube,
} from 'react-icons/bi'

const socialIconMap: Record<string, React.ReactNode> = {
  facebook: <BiLogoFacebookCircle className="size-6" />,
  instagram: <BiLogoInstagram className="size-6" />,
  x: <FaXTwitter className="size-6 p-0.5" />,
  linkedin: <BiLogoLinkedinSquare className="size-6" />,
  youtube: <BiLogoYoutube className="size-6" />,
  // add more platforms if you enabled them in schema
}

export async function Footer() {
  const locale = (await getLocale()) as 'en' | 'sl'
  const data = (await getFooterCached(locale)) as FooterType

  const columns = Array.isArray(data?.columns) ? data.columns : []
  const socials = Array.isArray(data?.socialLinks) ? data.socialLinks : []
  const footerLinks = Array.isArray(data?.footerLinks) ? data.footerLinks : []

  const companyHref = data?.companyImageHref || '#'

  return (
    <footer className="mt-auto border-t border-eggshell/10 bg-darkSky text-eggshell">
      <div className="container py-10 md:py-14 lg:py-16 px-[5%] md:px-0">
        <div className="grid grid-cols-1 gap-x-[4vw] gap-y-12 pb-10 md:gap-y-16 md:pb-14 lg:grid-cols-[1fr_0.5fr] lg:gap-y-4 lg:pb-16">
          {/* Left column: logo, , contact, socials */}
          <div>
            <div className="rb-6 mb-6 md:mb-8 text-eggshell/90">
              {data?.contact ? (
                <div className="flex flex-col gap-1">
                  {data.contact.label ? (
                    <p className="text-sm font-semibold text-eggshell/30 mb-3">
                      {data.contact.label}
                    </p>
                  ) : null}
                  {data.contact.phone ? (
                    <a
                      href={`tel:${data.contact.phone.replace(/[^\d+]/g, '')}`}
                      className="block text-sm underline decoration-eggshell/60 underline-offset-2 hover:decoration-eggshell"
                    >
                      {data.contact.phone}
                    </a>
                  ) : null}
                  {data.contact.email ? (
                    <a
                      href={`mailto:${data.contact.email}`}
                      className="block text-sm underline decoration-eggshell/60 underline-offset-2 hover:decoration-eggshell"
                    >
                      {data.contact.email}
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* Socials */}
            {socials.length > 0 ? (
              <div className="grid grid-flow-col grid-cols-[max-content] items-start justify-start gap-x-3">
                {socials.map((s, i) => (
                  <a
                    key={s?.id ?? i}
                    href={s?.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-80 transition hover:opacity-100"
                    aria-label={String(s?.platform || 'social')}
                  >
                    {socialIconMap[s?.platform as string] || (
                      <span className="inline-block size-6 rounded bg-eggshell/20" />
                    )}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {/* Right: columns with headers + links */}
          <div className="grid grid-cols-1 items-start gap-x-6 gap-y-10 sm:grid-cols-2 md:gap-x-8 md:gap-y-4">
            {columns.map((col, i) => {
              const links = Array.isArray(col?.links) ? col.links : []
              return (
                <div key={col?.id ?? i}>
                  {col?.header ? (
                    <h6 className="mb-2 text-sm font-semibold text-eggshell/30 md:mb-3">
                      {col.header}
                    </h6>
                  ) : null}
                  <ul>
                    {links.map(({ link }, j) => (
                      <li key={j} className="py-1 text-sm font-semibold">
                        <CMSLink
                          {...link}
                          className="text-eggshell/90 underline-offset-2 hover:text-white hover:underline"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>

        {/* Company image row (optional) */}
        {data?.companyImage ? (
          <div className="pb-8 md:pb-10 lg:pb-12">
            <TransitionLink href={companyHref} className="w-full">
              <Media
                resource={data.companyImage}
                alt="Company"
                imgClassName="h-auto w-full object-contain"
              />
            </TransitionLink>
          </div>
        ) : null}

        <div className="h-px w-full bg-eggshell/10" />

        {/* Bottom strip: text + footer links */}
        <div className="flex flex-col-reverse items-start justify-between pb-4 pt-6 text-sm text-eggshell/80 md:flex-row md:items-center md:pb-0 md:pt-8">
          {data?.footerText ? <p className="mt-8 md:mt-0">{data.footerText}</p> : <span />}

          {footerLinks.length > 0 ? (
            <ul className="grid grid-flow-row grid-cols-[max-content] justify-center gap-y-3 md:grid-flow-col md:gap-x-6 md:gap-y-0">
              {footerLinks.map(({ link }, i) => (
                <li
                  key={i}
                  className="underline decoration-eggshell/40 underline-offset-2 hover:decoration-eggshell"
                >
                  <CMSLink {...link} className="text-eggshell/90 hover:text-white" />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
