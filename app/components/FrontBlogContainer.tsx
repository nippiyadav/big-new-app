import Image from 'next/image'
import React from 'react'
import { HeroSectionProps } from './HeroSection';
import { dateformate } from '@/lib/utils';
import Link from 'next/link';

interface FrontBlogContainer extends HeroSectionProps{
  width:string,
  height:string,
}

const FrontBlogContainer = ({width="100px", height="240px",blogImageUrl,createdAt,category,slug,title,description,_id}:FrontBlogContainer) => {

  // const {blogImageUrl} = data

  return (
    <div className={` lg:w-[${width}%] h-[${height}] rounded-md overflow-hidden relative shortCardHover `}>
        <Image src={blogImageUrl} alt='shortBlog Image' width={400} height={400} layout="responsive"   className='w-full h-full object-cover object-top hoverScale' />

        <div className='absolute right-0 bottom-0  w-full gradient-overlap-shortBlog bg-black/5 h-full'/>

        <div className='absolute right-0 bottom-0  w-full gradient-overlap-shortBlog h-full'>

        <div className='absolute top-2 left-4 bg-black text-white font-serif p-2 px-4 rounded-md shadow-md lg-label-padding'>
            <span>{createdAt? dateformate(createdAt):"12 Aug 2024"}</span>
        </div>

        <div className='absolute top-2 right-4 bg-pink-500 text-white font-serif p-2 px-4 rounded-md shadow-md lg-label-padding'>
            <span>{category? category : "Horor"}</span>
        </div>

        </div>

        <div className='absolute text-white font-bold w-full right-0 bottom-0 p-2'>
          <Link href={`/category/${category}/${slug}-${_id}`}>
            <h1 className='text-xl cursor-pointer hover:underline hover:underline-offset-2 line-clamp-2'>{title? 
            title : "Popular admin template you can use for your business."}</h1>
            <p className='line-clamp-1   leading-snug'>{description && description}</p>
          </Link>
        </div>

    </div>
  )
}

export default FrontBlogContainer