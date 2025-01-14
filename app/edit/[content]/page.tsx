"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ContentEditor from '@/app/components/ContendEditor';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/readux/store';
import { singleArticleEditFetching } from '@/lib/readux/editContent';

export interface PropsContentEdit{
  blogImageUrl?: string;
  category?: string;
  slug?: string;
  content?: string;
  alt?: string;
  title?:string;
  description?:string;
  featuredImagealt?:string;
  _id?:string;
}

const ContentEdit = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const { content } = useParams(); // Await params to extract the `content` property
  
  console.log(content); // This will log the `content` from the dynamic route
  
  const {article,error,loading} = useSelector((state:RootState)=> state.edit);
  console.log(article); // This will log the `content` from the dynamic route
  const [contentObj,setContent] = useState<PropsContentEdit>(article as PropsContentEdit );

  useEffect(()=>{
    const response = async ()=>{
     try {
      dispatch(singleArticleEditFetching({id:content as string}))
 
      
     } catch (error) {
      console.log("Error in Fetching article in the edit:- ", error);
     }
    }
    response()
  },[content])
  
  return (
    <div>{contentObj? <ContentEditor {...contentObj}/> : <></>}</div>
  )
}

export default ContentEdit