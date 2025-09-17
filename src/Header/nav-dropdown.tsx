// components/NavDropdown.tsx
'use client'
import React from 'react'
import { RxChevronDown } from 'react-icons/rx'

interface NavDropdownProps {
  item: any
  index: number
  isOpen: boolean
  onOpen: (index: number) => void
}

export const NavDropdown: React.FC<NavDropdownProps> = ({ item, index, isOpen, onOpen }) => {
  return (
    <div className="relative" onMouseEnter={() => onOpen(index)}>
      <button
        type="button"
        className="flex h-10 items-center px-2 text-base "
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {item?.label}
        <RxChevronDown
          className={`ml-1 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
    </div>
  )
}
