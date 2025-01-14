"use client";

import { AuthFetchingBackend, AuthLogOut } from '@/lib/readux/authFetching';
import { AppDispatch, RootState } from '@/lib/readux/store';
import Link from 'next/link'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Header = () => {
    const disPatch = useDispatch<AppDispatch>();
    const {data,error,loading} = useSelector((state:RootState)=> state.auth);

    console.log("Header:- ",data,error,loading);

    useEffect(()=>{
        disPatch(AuthFetchingBackend())
    },[disPatch])

    const handleLogout = () => {
        disPatch(AuthLogOut()); // Dispatch the thunk action
    };
    
    return (
        <>

            <header className='flex flex-col '>
                <div className='bg-gradient-to-r to-red-300 from-red-500 flex justify-between p-2 items-center'>
                    <div>
                        <h1 className='text-2xl font-bold text-white max-sm:text-xl'><Link href="/">HumanTaking</Link></h1>
                    </div>

                    <div className='p-2'>
                        <span className='bg-white hover:bg-gray-50 font-bold rounded-md px-7 py-3 max-sm:px-3 max-sm:py-1'> 
                            {data? (<><button onClick={handleLogout}>Log Out</button></>)
                            :(<><Link href="/auth/login">Sign In</Link></>)}
                            
                        </span>
                    </div>
                </div>

            </header>
            <nav className='flex justify-center gap-4 items-center py-3 bg-slate-300 mb-4 sticky z-40 top-0 '>
                <ul className=' flex gap-4 font-bold text-xl text-black overflow-x-auto px-2 '>
                    <li><Link href="/article/cricket">Cricket</Link></li>
                    <li><Link href="/article/wwe">WWE</Link></li>
                    <li><Link href="/article/aew">AEW</Link></li>
                    <li><Link href="/article/free-fire">Free Fire</Link></li>
                    <li><Link href="/article/football">Football</Link></li>
                </ul>
            </nav>
        </>
    )
}

export default Header