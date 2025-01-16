"use client"
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux';
import { singleArticleFetching, SingleArticleProps } from '@/lib/readux/singleArticleFetched';
import { AppDispatch, RootState } from "@/lib/readux/store";
import ArticleShowerComp from '@/app/components/ArticleShowerComponents/ArticleShowerComp';
import { fetchCategories } from '@/lib/readux/categoryFetching';
import BlogContainer from '@/app/components/BlogContainer';


function ArticleShower() {
const dispatch = useDispatch<AppDispatch>();
const {category,slug} = useParams() as {slug:string,category:string};
console.log(category);

const {article,error,loading} = useSelector((state:RootState)=>state.singleArticle);

console.log(article,error,loading);


useEffect(()=>{
  const asyncFun = async()=>{
    if (slug) {
            const id = slug.split("-");
            const lengthMin = id.length - 1;
            console.log(id[lengthMin]);
            const articleData = {
              id :id[lengthMin],
              slug: slug
            };
            dispatch(singleArticleFetching(articleData))
          }
        }
    asyncFun();
  },[slug])
  

  const {data:categoryCamp,loading:loadingTrue} = useSelector((state:RootState)=>state.category);

  console.log(categoryCamp);
  

useEffect(()=>{
  dispatch(fetchCategories({category:category}))
},[category])

  return (
    <>
    <section>
      {article.map((elem,index)=>
      <ArticleShowerComp key={index} {...elem as SingleArticleProps}/>
      )}
    </section>
    <section className='max-w-screen-lg mx-auto px-3 mt-2'>
      <h1 className='font-bold lg:text-4xl text-2xl text-center mb-2'>Related Articles {category.toUpperCase()}</h1>
    {categoryCamp.map((elem, index) =>
            <BlogContainer {...elem} key={index} className='' />
          )}
    </section>
    </>
  )
}

export default ArticleShower














// const asyncFun = async()=>{
//     if (typeof slug === "string") {
//         const id = slug.split("-");
//         const lengthMin = id.length - 1;
//         console.log(id[lengthMin]);
//     }
// }













// how data is send to the dynamic routes
// useEffect(()=>{
//     const asyncFun = async()=>{
//         if (slug) {
//             const id = slug.split("-");
//             const lengthMin = id.length - 1;
//             console.log(id[lengthMin]);

//             const response = await fetch(`/category/${slug}/api?id=${id[lengthMin]}`)

//             if (response.ok) {
//                 const responseJson = await response.json();
//                 console.log(responseJson);
                
//             }
//         }
//     }
//     asyncFun();
// },[slug])