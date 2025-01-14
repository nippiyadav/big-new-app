import React, { useEffect, useState } from 'react'
import BigContainer from './BigContainer'
import SideContainer from './SideContainer'
import {useSelector } from 'react-redux'
import { RootState } from '@/lib/readux/store';
import { HeroSectionProps } from './HeroSection';

interface HeroBelowComponentsProps {
  category: string;
}

function HeroBelowComponents({category}:HeroBelowComponentsProps) {
  const [filteredValued,setfilteredValued] = useState<HeroSectionProps[]>([]);

  console.log("category:-",category);
  

  const {article, error,loading} = useSelector((state:RootState)=> state.article);
  console.log(article,error,loading);
  
  
  useEffect(()=>{
    if (article.length>0){
      const filteredValued = article.filter((filter)=> filter.category === category);
      console.log("Filtered value of cricket",filteredValued);
      setfilteredValued(filteredValued)
    }
    
  },[article]);

  return (
    <>
      <div className='shadow-md rounded-md bg-slate-500 mb-4 bg-gradient-to-r to-red-300 from-red-500'>
        <h1 className='text-center text-white text-4xl font-bold p-2 max-md:text-2xl'>{category.toUpperCase()}</h1>
      </div>
    <div className='flex gap-4 max-lg:flex-wrap'>
        {filteredValued.slice(0,1).map((elem,index)=>
        <BigContainer key={index} width='50' height='580px' className='' ShowImage={elem.blogImageUrl} blogDate={elem.createdAt} category={elem.category} description={elem.description} title={elem.title} slug={elem.slug} _id={elem._id} /> 
        )}
        <div className='w-[50%] shrink-0 max-lg:w-full grid grid-cols-1'>
          {filteredValued.slice(1).map((elem,index)=>
            <SideContainer {...elem} className='' key={index}/>
          )}
            
        </div>
    </div>
    </>
  )
}

export default HeroBelowComponents