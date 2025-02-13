import { Loader2 } from 'lucide-react'
import React from 'react'

const LoaderComponents = () => {
  return (
    <div className='flex justify-center items-center h-screen w-full'>
        <Loader2 className='animate-spin' size={48}/>
      </div>
  )
}

export default LoaderComponents