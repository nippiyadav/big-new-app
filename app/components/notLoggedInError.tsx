import Link from 'next/link'
import React from 'react'

interface NotLoggedINErrorProps {
    btnText:string;
    popupRef: React.RefObject<HTMLDivElement>
}

function NotLoggedINError({btnText,popupRef}:NotLoggedINErrorProps) {
  return (
    <div ref={popupRef} className={` absolute ${btnText === "Follow"?"right-0 mt-2":""
    }`}>
    <Link  href={"/auth/login"}>
    <div className={` bg-gray-900 text-white mt-3  p-2 rounded-md shadow-md min-w-[200px] max-w-[250px] $`}>
            <p>{`Want to ${btnText} Video`}</p>
            <p>Please <li className='text-blue-500 hover:underline list-none'>Logged In</li></p>
            </div>
    </Link>
    </div>
  )
}

export default NotLoggedINError