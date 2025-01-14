import React, { forwardRef } from 'react'

interface InputProps {
    name:string,
    className:string,
    placeholder:string,
    lableText:string,
    type?:string,
    inputname?:string
}

const Input = forwardRef<HTMLInputElement,InputProps>(({className,name,lableText,...props},ref)=>{
    return(
        <div className='flex flex-wrap gap-4 items-center justify-center'>
        <label className='font-bold w-[20%]' htmlFor={name}>{lableText}</label>
        <input name={name} className={`outline-none focus:ring-1 shadow-inner px-7 py-3 rounded-md bg-slate-100 flex-1 ${className}`} {...props} ref={ref}/>
        </div>
    )
})

export default Input