import React from 'react'
import { Link } from 'react-router-dom'

export default function Button({children, disabled, to, type, onClick}) {
  const base = `bg-yellow-400 uppercase font-semibold text-stone-800  inline-block tracking-wide rounded-full hover:bg-yellow-300 transition-colors duration-200 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-offset-2 disabled:cursor-not-allowed`
  const styles = {
    round:base +'px-2.5 py-1 md:px-3.5 md:py-2 text-sm' ,
    primary: base + 'px-4 py-3 md:px-6 md:py-3',
    small:base + 'px-4 py-2 md:px-5 md:py-2.5',
    secondary: 'border-2 border-stone-300 uppercase font-semibold text-stone-400  inline-block tracking-wide rounded-full hover:bg-stone-300 hover:text-stone-800 transition-colors duration-200 focus:outline-none focus:bg-stone-300 focus:ring focus:ring-stone-200 focus:text-stone-800 focus:ring-offset-2 disabled:cursor-not-allowed px-4 py-2.5 md:px-5 md:py-3.5'
  }
    if (to) {
        return (
            <Link to = {to} className= {styles[type]}>{children}</Link>
        )
    }
    if (onClick) {
      return (
        <button className= {styles[type]} disabled = {disabled} onClick={onClick}>{children}</button>

      )
    }
  return (
    <button className= {styles[type]} disabled = {disabled}>{children}</button>
  )
}
