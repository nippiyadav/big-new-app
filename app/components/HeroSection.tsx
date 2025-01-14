"use client"
import Image from 'next/image'
import React from 'react'
import FrontBlogContainer from './FrontBlogContainer'
// import BlogContainer from './BlogContainer'
import BigContainer from './BigContainer'
import { CreatedAuthor } from '@/lib/readux/articleFetchSlice'

 export interface HeroSectionProps{
    createdAt?: string;
    updatedAt?: string;
    createdBy: CreatedAuthor;
    blogImageUrl: string;
    featuredImagealt: string;
    title:string;
    description:string;
    category: string;
    views?: number;
    likes?: number[];
    dislikes?: number[];
    public?: boolean;
    slug: string;
    content?: string;
    _id:string;
}


const HeroSection = ({ newArticle }: { newArticle: HeroSectionProps[] }) => {

    console.log(newArticle.slice(1,3));
    return (
        
        <section className=' flex gap-4 max-lg:flex-wrap lg:h-[580px]'>

            <BigContainer ShowImage={newArticle[0].blogImageUrl} blogDate={newArticle[0].createdAt || ""} category={newArticle[0].category} description={newArticle[0].description} title={newArticle[0].title}
            slug={newArticle[0].slug} _id={newArticle[0]._id} width='60' height='100' className=''/>

            <div className='lg:shrink-0 grid max-lg:grid-cols-2 max-md:grid-cols-1  gap-4 max-lg:w-[100%] lg:w-[40%]'>
                {newArticle.length > 1 && (newArticle.slice(1,3).map((elem,index)=>
                 <FrontBlogContainer key={index} width='100px' height='240px' {...elem} />
                ))}

            </div>

        </section>
        
    )
}

export default HeroSection












{/* <FrontBlogContainer width='100' height='240px' src='https://mannatthemes.com/blogloo/default/assets/images/blogs/s-1.jpg' />
<FrontBlogContainer width='100' height='240px' src='https://mannatthemes.com/blogloo/default/assets/images/blogs/s-2.jpg' /> */}