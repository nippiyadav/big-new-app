'use client'
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch ,RootState} from '@/lib/readux/store'
import { fetchCategories } from '@/lib/readux/categoryFetching';
import CateryShower from '@/app/components/CategoryShower/CateryShower';
import LoaderComponents from '@/app/components/LoaderComponents';

const Page = () => {
  const { articlecategory } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const {data,error,loading} = useSelector((state:RootState)=>state.category);

  console.log(data,error,loading);
  

  useEffect(()=>{
    dispatch(fetchCategories({category:`${articlecategory}`}));
  },[articlecategory])

  return (
    <section>
      {data.length>0? 
      <CateryShower data={data}/>
      :
      <>
      <LoaderComponents/>
      </>}
    </section>
  )
}

export default Page