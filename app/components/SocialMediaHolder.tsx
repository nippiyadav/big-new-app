import React from 'react'

interface SocialMediaHolderProps{
    text:string,
    className:string,
}
const SocialMediaHolder = ({text,className="",}:SocialMediaHolderProps) => {
  return (
    <div className={`rounded-full w-[44px] h-[44px] text-center leading-10 font-bold ${className}`}>
        {text}
    </div>
  )
}

export default SocialMediaHolder