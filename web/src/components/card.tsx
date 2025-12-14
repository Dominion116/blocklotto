import React from 'react'

export function Card({ title, children, className = '' }: any) {
  return (
    <div className={`border border-gray-800 p-3 md:p-4 rounded-md bg-[#050505] ${className}`}>
      {title && <div className="text-xs md:text-sm text-gray-400 mb-2 font-medium">{title}</div>}
      <div>{children}</div>
    </div>
  )
}
