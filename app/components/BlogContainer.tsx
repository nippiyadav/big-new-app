import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { HeroSectionProps } from './HeroSection'
import { dateformate } from '@/lib/utils'

interface BlogContainerProps extends HeroSectionProps {
    className: string
}

const BlogContainer = ({ className = "", blogImageUrl, category, slug, createdAt, title, description, _id, createdBy }: Partial<BlogContainerProps>) => {
    return (
        <section className={`flex gap-4 rounded-md shadow-md p-2 flex-wrap ${className}`}>
            <div className={`w-full mx-auto min-[768px]:w-[200px] h-[200px] shrink-0 overflow-hidden rounded-md`}>
                <Image src={blogImageUrl ? blogImageUrl : "https://mannatthemes.com/blogloo/default/assets/images/widgets/sm-3.jpg"} alt='blog image'
                    loading='lazy'
                    width={1000} height={1000}
                    className='h-full w-full object-cover  hoverScale' />
            </div>

            <div className='flex flex-col justify-between flex-1 gap-4'>
                <div className='flex flex-col gap-4'>
                    <div className='flex gap-4 items-center'>
                        <span className='bg-red-400 px-4 py-2 rounded-md text-xl'>{category ? category : "Health"}</span>
                        <span className='font-serif font-semibold'>{createdAt ? dateformate(createdAt) : "23 Aug 2023"}</span>
                    </div>
                    <div>
                        {/* /category/ this is redefined because to give a static if we do not does then it will add other route automatically and cause link direct */}
                        <Link href={`/category/${category}/${slug}-${_id}`} title={title}>
                            <h2 className='font-bold text-xl line-clamp-2 hover:underline'>{title && title}</h2>
                        </Link>
                        <p className='line-clamp-2'>{description && description}</p>
                    </div>
                </div>
                <div>
                    {createdBy?.email?
                        (<>
                            <div className='flex justify-between items-center flex-wrap gap-4'>
                                <Link href={`/${createdBy?.username}`}>

                                    <div className='flex gap-2'>
                                        <Image src="https://mannatthemes.com/blogloo/default/assets/images/users/avatar-1.jpg" alt="avatar Image" width={100} height={100} className='object-cover w-[44px] h-[44px] rounded-full' />
                                        <div className='flex flex-col'>
                                            <span className='font-semibold italic'>{createdBy?.fullname}</span>
                                            <span>
                                                {`@${createdBy?.username}`}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                                <div>
                                    <span className='font-semibold italic hover:underline'>
                                        <Link href={`/category/${category}/${slug}-${_id}`} title={title}>Read More</Link>
                                    </span>
                                </div>
                            </div>
                        </>)
                        :
                        (<></>)
                    }
                </div>
            </div>
        </section>
    )
}

export default BlogContainer