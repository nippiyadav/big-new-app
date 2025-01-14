import Image from 'next/image'
import React from 'react'
import { dateformate,slugChangeIntoTitle } from '@/lib/utils';
import Link from 'next/link';

interface BigContainerProps {
    ShowImage: string;
    blogDate?: string;
    category: string;
    title: string;
    description: string;
    width: string;
    height: string;
    className: string;
    slug:string;
    _id:string;
}

function BigContainer({ width = "", height = "", className = "",ShowImage,category,blogDate,title,description,slug,_id }: BigContainerProps) {

   

    return (
        <section className={`w-full lg:w-[${width}] h-[${height}] ${className}`}>
            <section className={`w-full lg:w-full h-full rounded-md overflow-hidden relative shortCardHover`}>
                <Image src={ShowImage? ShowImage:`https://mannatthemes.com/blogloo/default/assets/images/blogs/4.jpg`} alt='shortBlog Image' loading='lazy' width={1000} height={1000} 
                layout="responsive" 
                quality={100} className='w-full h-full object-cover object-top hoverScale' style={{aspectRatio:"16/9"}} />

                <div className='absolute right-0 bottom-0  w-full gradient-overlap-shortBlog bg-black/5 h-full' />

                <div className='absolute right-0 bottom-0  w-full gradient-overlap-shortBlog h-[50%]'>

                    <div className='absolute top-1 left-4 bg-black text-white font-serif p-2 px-4 rounded-md shadow-md lg-label-padding'>
                        <span>{blogDate ? dateformate(blogDate) :"12 Aug 2024"}</span>
                    </div>

                    <div className='absolute top-1 right-4 bg-pink-500 text-white font-serif p-2 px-4 rounded-md shadow-md lg-label-padding'>
                        <span>{category? category :"Horor"}</span>
                    </div>

                </div>

                <div className='absolute text-white font-bold w-full right-0 bottom-0 p-2'>
                    <Link href={`/category/${category}/${slug}-${_id}`}>
                    <h1 className='text-4xl cursor-pointer hover:underline hover:underline-offset-2 line-clamp-2 leading-[50px] max-md:text-xl max-md:leading-[25px] max-md:line-clamp-1'>{title? slugChangeIntoTitle(title) : "Popular admin template you can use for your business."}</h1>
                    <p className='text-xl line-clamp-1   leading-snug max-md:text-[12px]'>{description && description}</p>
                    </Link>
                </div>

            </section>
        </section>

    )
}

export default BigContainer



/*
<Image src={ShowImage? ShowImage:`https://mannatthemes.com/blogloo/default/assets/images/blogs/4.jpg`} alt='shortBlog Image' width={1000} height={1000} 
                unoptimized
                layout="responsive" 
                priority
                quality={100} className='w-full h-full object-cover object-top hoverScale' style={{aspectRatio:"16/9"}} />


                
*/