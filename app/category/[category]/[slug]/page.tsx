"use client"
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux';
import { singleArticleFetching, SingleArticleProps } from '@/lib/readux/singleArticleFetched';
import { AppDispatch, RootState } from "@/lib/readux/store";
import ArticleShowerComp from '@/app/components/ArticleShowerComponents/ArticleShowerComp';

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

  return (
    <section>
      {article.map((elem,index)=>
      <ArticleShowerComp key={index} {...elem as SingleArticleProps}/>
      )}
    </section>
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