// import Header from "@/app/components/Header";
// import type { Metadata } from "next";
import React from "react";



export default function ArticleRootPage({children}:Readonly<{
    children: React.ReactNode;
  }>){
    return(
        <>
        {/* <Header/> */}
        {children}
        </>
    )
}