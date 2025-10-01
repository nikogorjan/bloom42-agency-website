// src/blocks/FaqAccordion/component.tsx
'use client'

import * as React from 'react'
import type { FaqAccordionBlock } from '@/payload-types'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@relume_io/relume-ui'
import { RxPlus } from 'react-icons/rx'
import { RichTextCustom } from '@/components/common/rich-text/rich-text'

type Props = FaqAccordionBlock

export default function FaqAccordionComponent(props: Props) {
  const { heading, description, questions = [] } = props

  return (
    <section id="faq-accordion" className="px-[5%] py-16 md:py-24 lg:py-28 bg-darkSky">
      <div className="container">
        {/* Heading + optional description */}
        <div className="rb-12 mb-12 max-w-lg md:mb-18 lg:mb-20">
          {heading ? (
            <h2 className="font-anton rb-5 mb-5 text-5xl md:mb-6 md:text-7xl lg:text-8xl text-eggshell">
              {heading}
            </h2>
          ) : null}
          {description ? (
            <div className="prose-invert md:text-md text-eggshell/90">
              <RichTextCustom text={description} className="text-base" />
            </div>
          ) : null}
        </div>

        {/* Accordion */}
        <Accordion type="multiple" className="grid items-start justify-stretch gap-4">
          {Array.isArray(questions) &&
            questions.map((q, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl border border-eggshell/15 bg-darkPaper px-5 md:px-6"
              >
                <AccordionTrigger
                  icon={
                    <RxPlus className="size-7 shrink-0 text-eggshell transition-transform duration-300 md:size-8" />
                  }
                  className="md:py-5 md:text-md text-eggshell [&[data-state=open]>svg]:rotate-45 text-left"
                >
                  {q?.title}
                </AccordionTrigger>
                <AccordionContent className="md:pb-6 text-eggshell/90">
                  {q?.answer ? <RichTextCustom text={q.answer} className="text-base" /> : null}
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    </section>
  )
}
