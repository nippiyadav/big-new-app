import Image from 'next/image'
import React from 'react'
import Button from './Button'

interface AvatarComponentsProps{
  image?:string;
  username:string;
  fullname:string
}

function AvatarComponents({image,username,fullname}:AvatarComponentsProps) {
  return (
    <div className='flex justify-between items-center flex-wrap gap-4 mt-4'>
          <div className='flex gap-2 items-center'>
            <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIf4R5qPKHPNMyAqV-FjS_OTBB8pfUV29Phg&s" alt="avatar Image" width={100} height={100} className='object-cover w-[44px] h-[44px] rounded-full' />
            <div className='flex-1 flex justify-around w-full flex-col'>
              <span className=' font-bold text-xl max-md:text-[12px] '>{fullname}</span>
              <span className='text-sm max-md:text-[12px]'>
                @{username}
              </span>
            </div>
          </div>
        <div>
            <Button className='bg-red-400 hover:bg-red-600 font-bold text-white' text='Follow' />
        </div>
        </div>
  )
}

export default AvatarComponents