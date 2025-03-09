import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { HeroSectionProps } from './HeroSection'
import { dateformate } from '@/lib/utils'

interface FrontBlogContainer extends HeroSectionProps{
  width?:string,
  height?:string,
  className:string
}

const SideContainer = ({className="",blogImageUrl,category,description,title,createdAt,slug,_id,createdBy}:FrontBlogContainer) => {
  return (
    <section className={`flex gap-4 rounded-md shadow-md p-2 flex-wrap ${className}`}>
            <div className={`mx-auto min-[768px]:w-[100px] h-[100px] shrink-0 overflow-hidden rounded-md`}>
                <Image src={blogImageUrl?blogImageUrl:"https://mannatthemes.com/blogloo/default/assets/images/widgets/sm-3.jpg"} alt='blog image' width={200} height={200} className='h-full object-cover w-full object-top  hoverScale' />
            </div>
            <div className='flex flex-col justify-between flex-1 gap-2'>
                <div className='flex flex-col gap-1'>
                    <div className='flex gap-4 items-center'>
                        <span className='bg-red-400 p-1 px-2 rounded-md'>{category? category:"Politics"}</span>
                        <span className='font-serif font-semibold'>{createdAt?dateformate(createdAt):"23 Aug 2023"}</span>
                    </div>
                    <div>
                        <Link href={`/category/${category}/${slug}-${_id}`}>
                        <h2 className='font-bold text line-clamp-1 hover:underline'>{title && title}</h2>
                        </Link>
                        <p className='line-clamp-1'>{description && description} </p>
                    </div>
                </div>
                <div>
                    <div className='flex justify-between items-center flex-wrap gap-4'>
                        <Link href={`/${createdBy.username}`}>
                        <div className='flex gap-2'>
                            <Image src="https://mannatthemes.com/blogloo/default/assets/images/users/avatar-1.jpg" alt="avatar Image" width={100} height={100} className='object-cover w-[22px] h-[22px] rounded-full' />
                            <div className='flex-1 flex justify-around w-full gap-4'>
                                <span className=' font-semibold text-[12px] italic '>{createdBy.fullname}</span>
                                <span className='text-[12px]'>
                                    {`@${createdBy.username}`}
                                </span>
                            </div>
                        </div>
                        </Link>
                    
                    </div>
                </div>
            </div>
        </section>
  )
}

export default SideContainer
















{/* <video preload="none" tabindex="-1" playsinline aria-label="Embedded video" poster="https://pbs.twimg.com/amplify_video_thumb/1850465523496361984/img/Knnk3NwTrfD8gCWS.jpg" style="width: 100%; height: 100%; position: absolute; background-color: black; top: 0%; left: 0%; transform: rotate(0deg) scale(1.005);"><source type="video/mp4" src="blob:https://x.com/58d87a5a-1de9-49a0-acdb-9fd7efb1901b">
</video> */}