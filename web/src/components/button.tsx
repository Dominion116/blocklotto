import React from 'react'

export function Button(props: any) {
  const { children, className = '', ...rest } = props
  return (
    <button
      {...rest}
      className={"bg-white text-black px-4 py-2 rounded-md hover:brightness-90 disabled:opacity-50 " + className}
    >
      {children}
    </button>
  )
}
