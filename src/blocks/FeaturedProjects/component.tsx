'use client' // if you are on Next.js 13+ app router

import React from 'react'
import type { FeaturedProjectsBlock } from '@/payload-types'

export const FeaturedProjects: React.FC<FeaturedProjectsBlock> = ({
  tagline,
  heading,
  description,
  projects,
}) => {
  // Safely default to empty array if `projects` is undefined or null
  const safeProjects = projects ?? []

  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        {/* Header */}
        <header className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
          {tagline && <p className="mb-3 font-semibold md:mb-4">{tagline}</p>}
          {heading && (
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
          )}
          {description && <p className="md:text-md">{description}</p>}
        </header>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-3">
          {safeProjects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>

        {/* Main Button (footer) 
        {button?.title && (
          <footer className="mt-12 flex justify-center md:mt-18 lg:mt-20">
            <Button {...button}>{button.title}</Button>
          </footer>
        )}*/}
      </div>
    </section>
  )
}

// Helper sub-component to render each project
const ProjectCard: React.FC<{
  project: NonNullable<FeaturedProjectsBlock['projects']>[0]
}> = ({ project }) => {
  if (!project) return null

  const { title, description, url, image, button, tags } = project

  return (
    <article className="border border-border-primary">
      {/* Image */}
      <div>
        <a href={url ?? '#'}>
          {image?.src && (
            <img src={image.src} alt={image.alt ?? ''} className="w-full object-cover" />
          )}
        </a>
      </div>

      {/* Text and details */}
      <div className="px-5 py-6 sm:px-6">
        {title && (
          <h3 className="mb-2 text-xl font-bold md:text-2xl">
            <a href={url ?? '#'}>{title}</a>
          </h3>
        )}
        {description && <p>{description}</p>}

        {/* Tags */}
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

        {/* Button 
        {button?.title && (
          <Button {...button} asChild className="mt-5 md:mt-6">
            <a href={url ?? '#'}>{button.title}</a>
          </Button>
        )}*/}
      </div>
    </article>
  )
}
