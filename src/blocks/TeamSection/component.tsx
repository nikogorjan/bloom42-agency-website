// src/blocks/TeamSection/component.tsx
'use client'

import React from 'react'
import type { TeamSectionBlock, Media as MediaDoc, TeamMember } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { BiLogoLinkedinSquare, BiLogoFacebook, BiLogoInstagram, BiGlobe } from 'react-icons/bi'
import { FaXTwitter } from 'react-icons/fa6'

type Props = TeamSectionBlock

export default function TeamSectionComponent(props: Props) {
  const { tagline, heading, description, footer } = props

  // Relationship value can be ids or populated docs; normalize to docs
  const selected: TeamMember[] = (props.members ?? []).filter(
    (m): m is TeamMember => typeof m === 'object' && m !== null,
  )

  const members: TeamMember[] = selected
  // Normalize CTA
  let ctaLink: any | undefined
  const rawCTA = (footer as any)?.cta
  if (rawCTA) {
    if (Array.isArray(rawCTA) && rawCTA.length > 0 && rawCTA[0]?.link) {
      ctaLink = rawCTA[0].link
    } else if (!Array.isArray(rawCTA) && rawCTA.link) {
      ctaLink = rawCTA.link
    }
  }

  if (!members.length && !heading && !description && !tagline) return null

  return (
    <section id="team" className="px-[5%] py-16 md:py-24 lg:py-28 bg-eggshell">
      <div className="container">
        {(tagline || heading || description) && (
          <div className="rb-12 mb-12 max-w-lg md:mb-18 lg:mb-20">
            {tagline && <p className="mb-3 font-semibold md:mb-4">{tagline}</p>}
            {heading && (
              <h2 className="rb-5 mb-5 text-5xl font-anton text-darkGray md:mb-6 md:text-7xl lg:text-8xl">
                {heading}
              </h2>
            )}
            {description && <p className="md:text-md">{description}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:gap-x-12">
          {members.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>

        {(footer?.heading || footer?.description || ctaLink) && (
          <div className="mt-14 w-full max-w-md md:mt-20 lg:mt-24">
            {footer?.heading ? (
              <h4 className="mb-3 text-2xl font-anton text-darkGray md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
                {footer.heading}
              </h4>
            ) : null}
            {footer?.description ? <p className="md:text-md">{footer.description}</p> : null}
            {ctaLink ? (
              <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
                <CMSLink {...ctaLink} />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}

/* ---------------- cards ---------------- */

function TeamMemberCard({ member }: { member: TeamMember }) {
  const socials = (member.socials as any) || {}

  const socialItems: { href?: string | null; icon: React.ReactNode; label: string }[] = [
    {
      href: socials?.linkedin,
      icon: <BiLogoLinkedinSquare className="size-6" />,
      label: 'LinkedIn',
    },
    { href: socials?.x, icon: <FaXTwitter className="size-6 p-0.5" />, label: 'X' },
    { href: socials?.facebook, icon: <BiLogoFacebook className="size-6" />, label: 'Facebook' },
    { href: socials?.instagram, icon: <BiLogoInstagram className="size-6" />, label: 'Instagram' },
    { href: socials?.website, icon: <BiGlobe className="size-6" />, label: 'Website' },
  ]

  return (
    <div className="flex flex-col p-2 bg-white rounded-2xl">
      <div className="relative mb-2 aspect-square size-full overflow-hidden rounded-[14px] border border-eggshell md:mb-2 md:pt-[100%]">
        <MemberPhoto media={member.image as any} />
      </div>

      <div className="p-4 bg-gray-50 border border-gray-50 rounded-[14px]">
        <div className="mb-3 md:mb-4">
          {member?.name ? (
            <h5 className="text-md font-semibold md:text-lg">{member.name as unknown as string}</h5>
          ) : null}
          {member?.jobTitle ? (
            <h6 className="md:text-md text-neutral-700">{member.jobTitle as unknown as string}</h6>
          ) : null}
        </div>

        {member?.description ? <p>{member.description as unknown as string}</p> : null}

        <div className="mt-6 flex items-center gap-[0.875rem] self-start">
          {socialItems
            .filter((s) => !!s.href)
            .map((s, i) => (
              <a
                key={i}
                href={s.href!}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-80 transition hover:opacity-100"
              >
                {s.icon}
              </a>
            ))}
        </div>
      </div>
    </div>
  )
}

/* ---------------- helpers ---------------- */

function MemberPhoto({ media }: { media?: MediaDoc | string | null }) {
  if (!media) return null
  return (
    <div className="absolute inset-0">
      <Media resource={media} fill imgClassName="object-cover" />
    </div>
  )
}
