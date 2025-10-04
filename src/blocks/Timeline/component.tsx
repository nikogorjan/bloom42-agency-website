import * as React from 'react'
import type { TimelineBlock } from '@/payload-types'
import { RichTextCustom } from '@/components/common/rich-text/rich-text'
import clsx from 'clsx'

type Props = TimelineBlock

const TimelineBlockComponent: React.FC<Props> = ({ items }) => {
  const list = Array.isArray(items) ? items : []
  if (!list.length) return null

  return (
    <section id="timeline" className="overflow-hidden px-[5%] py-16 md:py-24 lg:py-28 bg-darkSky">
      <div className="container">
        <div className="relative grid auto-cols-fr grid-flow-row grid-cols-1 items-center justify-center md:grid-flow-col md:grid-cols-[max-content_1fr] md:justify-normal">
          {/* Base line (desktop) */}
          <div className="relative hidden md:grid md:grid-cols-1 md:gap-4">
            <div className="flex flex-col items-center md:w-full md:flex-row">
              <div className="h-full w-[3px] bg-eggshell md:h-[3px] md:w-full" />
            </div>
          </div>

          {/* Items */}
          {list.map((it, index) => (
            <TimelineRow
              key={index}
              index={index}
              isLastItem={index === list.length - 1}
              date={it?.date ?? ''}
              description={it?.description}
            />
          ))}

          {/* subtle fade tail */}
          <div className="absolute right-0 z-0 h-1 w-16 bg-gradient-to-r from-transparent to-white" />
        </div>
      </div>
    </section>
  )
}

function TimelineRow({
  date,
  description,
  index,
  isLastItem,
}: {
  date: string
  description: any
  index: number
  isLastItem: boolean
}) {
  const isEven = index % 2 === 0

  const Content = ({ className }: { className?: string }) => (
    <div className={clsx('mb-8 flex flex-col items-start md:mb-0 md:mr-4', className)}>
      <h3 className="mb-2 text-xl font-anton text-eggshell md:text-2xl">{date}</h3>
      {description ? (
        <RichTextCustom text={description} className="text-base md:text-md text-eggshell" />
      ) : null}
    </div>
  )

  const Line = () => (
    <div className="flex flex-col items-center md:w-full md:flex-row">
      <div className="z-20 size-[0.9375rem] flex-none rounded-full bg-coral shadow-[0_0_0_8px_white]" />
      <div
        className={clsx('h-full w-[3px] bg-eggshell md:h-[3px] md:w-full', {
          'hidden md:block': isLastItem,
        })}
      />
    </div>
  )

  return (
    <div className="relative grid auto-cols-fr grid-cols-[max-content_1fr] gap-4 md:grid-cols-1 md:grid-rows-[1fr_max-content_1fr]">
      {isEven ? (
        <>
          <div className="hidden md:block" />
          <Line />
          <Content />
        </>
      ) : (
        <>
          <Content className="order-last md:order-none" />
          <Line />
          <div className="hidden md:block" />
        </>
      )}
    </div>
  )
}

export default TimelineBlockComponent
