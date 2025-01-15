"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ContentEditor from '@/app/components/ContendEditor';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/readux/store';
import { singleArticleEditFetching } from '@/lib/readux/editContent';

export interface PropsContentEdit {
  blogImageUrl?: string;
  category?: string;
  slug?: string;
  content?: string;
  alt?: string;
  title?: string;
  description?: string;
  featuredImagealt?: string;
  _id?: string;
}

const ContentEdit = () => {
  const dispatch = useDispatch<AppDispatch>()

  const { content } = useParams(); // Await params to extract the `content` property

  console.log(content); // This will log the `content` from the dynamic route

  const [contentObj, setContent] = useState<PropsContentEdit>();

  const {article,loading,error} = useSelector((state:RootState)=> state.edit);

  console.log(article);
  

  useEffect(()=> {
    if (article) {
      setContent(article as PropsContentEdit)
    }
  },[article])
  


  useEffect(() => {
    console.log("inside the dedit useEffect");
    
    const response = async () => {
      try {
        await dispatch(singleArticleEditFetching({id:content as string}))
        // const response = await fetch(`/edit/content/api?contentId=${content}&content=Get`);

        // if (response.ok) {
        //   const jsonConverted = await response.json();
        //   console.log(jsonConverted);
        //   if (jsonConverted?.data[0]) {
        //     setContent(jsonConverted?.data[0])
        //   }

        // }
      } catch (error) {
        console.log("Error in Fetching article in the edit:- ", error);
      }
    }
    response();
  }, [content])

  return (
    <div>{contentObj?._id ? <ContentEditor {...contentObj} /> : <></>}</div>
  )
}

export default ContentEdit