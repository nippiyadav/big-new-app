"use client"
import React, { useEffect, useState } from 'react'
import Header from './Header'
import { usePathname} from 'next/navigation'

const HeaderWrapper = () => {
     const router = usePathname();
     const [routers,setRouter] = useState("");

     console.log("HeaderWrapper",router);
     useEffect(()=>{
        setRouter(router)
     },[router])
     
  return (
    <>
    {(routers === "/auth/login" || routers === "/auth/signup" ) ? <></> : <Header/>}
    </>
  )
}

export default HeaderWrapper