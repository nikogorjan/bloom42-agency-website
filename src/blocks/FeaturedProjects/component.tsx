// src/blocks/FeaturedProjects/component.tsx
'use client'

import React from 'react'
import type { FeaturedProjectsBlock } from '@/payload-types'
import { Media } from '@/components/Media'

export const FeaturedProjects: React.FC<FeaturedProjectsBlock> = ({
  tagline,
  heading,
  description,
  projects,
}) => {
  const safeProjects = projects ?? []

  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <header className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
          {tagline && <p className="mb-3 font-semibold md:mb-4">{tagline}</p>}
          {heading && (
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
          )}
          {description && <p className="md:text-md">{description}</p>}
        </header>

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-3">
          {safeProjects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}

const ProjectCard: React.FC<{
  project: NonNullable<FeaturedProjectsBlock['projects']>[0]
}> = ({ project }) => {
  if (!project) return null
  const { title, description, url, image, tags } = project

  return (
    <article className="border border-border-primary">
      {/* Image */}
      <a href={url ?? '#'} className="block">
        {image?.src && (
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            <Media
              src={image.src}
              alt={image.alt ?? ''}
              fill
              imgClassName="object-cover"
              // no priority for grid items (let LCP focus elsewhere)
            />
          </div>
        )}
      </a>

      {/* Text and details */}
      <div className="px-5 py-6 sm:px-6">
        {title && (
          <h3 className="mb-2 text-xl font-bold md:text-2xl">
            <a href={url ?? '#'}>{title}</a>
          </h3>
        )}
        {description && <p>{description}</p>}

        {tags && tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2 md:mt-4">
            {tags.map((tag, i) => (
              <li key={i} className="flex">
                <a
                  href={tag.url ?? '#'}
                  className="bg-background-secondary px-2 py-1 text-sm font-semibold"
                >
                  {tag.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
