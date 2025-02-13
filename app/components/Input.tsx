import React, { forwardRef } from 'react'
import { FieldError} from 'react-hook-form'

interface InputProps {
    name:string,
    className:string,
    placeholder:string,
    lableText:string,
    type?:string,
    inputname?:string,
    errors?:FieldError
}

const Input = forwardRef<HTMLInputElement,InputProps>(({className,name,errors,lableText,...props},ref)=>{
    return(
        <div className='flex flex-wrap gap-4 items-center justify-center'>
        <label className='font-bold w-[20%]' htmlFor={name}>{lableText}</label>
        <input name={name} className={`outline-none focus:ring-1 shadow-inner px-7 py-3 rounded-md bg-slate-100 flex-1 ${className}`} {...props} ref={ref}/>

        {/* Render error message if error exists */}
        {errors && <p className="text-red-500">{errors.message}</p>}
        </div>
    )
})

export default Input