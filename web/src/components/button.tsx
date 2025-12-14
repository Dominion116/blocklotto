import React from 'react'

export function Button(props: any) {
  const { children, className = '', ...rest } = props
  return (
    <button
      {...rest}
      className={`bg-white text-black px-3 py-2 md:px-4 md:py-2 text-sm md:text-base rounded-md hover:brightness-90 disabled:opacity-50 transition-all ${className}`}
    >
      {children}
    </button>
  )
}
