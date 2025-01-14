import React from 'react'
interface ButtonProps{
    className:string;
    text:string;
    submission?:boolean
    type?:"submit" | "reset" | "button" 
}
function Button({className,type,text,submission,...props}:ButtonProps) {
  return (
    <button {...props} type={type} className={`px-7 py-3 rounded-full shadow-sm ${className}`}>{submission?"Loading":text}</button>
  )
}

export default Button