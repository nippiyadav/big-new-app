import Image from 'next/image'
import React from 'react'

const ShortBlogContainer = () => {
    return (
        <section className='p-2'>
            <div className=' min-[340px]:w-[340px] h-full rounded-md overflow-hidden relative shortCardHover'>
                <Image src="https://mannatthemes.com/blogloo/default/assets/images/widgets/3.jpg" alt='shortBlog Image' width={350} height={350} className='w-full h-full hoverScale saturate-200 brightness-150' />

                <div className='absolute top-1 left-1 bg-black text-white font-serif p-2 rounded-md shadow-md'>
                    <span>12 Aug 2024</span>
                </div>

                <div className='absolute top-1 right-1 bg-black text-white font-serif p-2 rounded-md shadow-md'>
                    <span>Horor</span>
                </div>

                <div className='absolute right-0 bottom-0  w-full h-full gradient-overlap-shortBlog'>
                </div>

                <div className='absolute text-white font-bold w-full right-0 bottom-0 p-2'>
                    <h1 className='text-xl cursor-pointer hover:underline hover:underline-offset-2'>Popular admin template you can use for your business.</h1>
                    <p>It is a long established fact...</p>
                </div>

            </div>
        </section>
    )
}

export default ShortBlogContainer