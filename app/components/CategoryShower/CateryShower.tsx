import { categoryFetchedData } from '@/lib/readux/categoryFetching'
import React from 'react'
import BlogContainer from '../BlogContainer';
import HeroSection from '../HeroSection';



const CateryShower = ({data}:{data:categoryFetchedData[]}) => {
    console.log(data);
    
  return (
    // <h1>Hello</h1>
    <main className='lg:max-w-[80%] max-lg:w-[98%] mx-auto flex flex-col gap-4'>
        {/* Header  */}

        {/* Hero Section */}
        {data.length > 0 && (
          <HeroSection newArticle={data.slice(0, 3)} />)}

        <div className='grid gap-4 lg:grid-cols-2'>
          {data.slice(3, ).map((elem, index) =>
            <BlogContainer {...elem} key={index} className='' />
          )}

        </div>
        </main>
  )
}

export default CateryShower