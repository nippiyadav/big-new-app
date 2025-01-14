import React from 'react'

interface buttonProps{
    onClick : () => Promise<void>;
    animation:boolean
}

const AiButton = ({onClick,animation}:buttonProps) => {
  return (
    <div className='px-4 py-2 bg-green-400 rounded-md hover:bg-green-600 font-bold' onClick={onClick}>{animation? "Ai Writer...":"Ai Writer"}</div>
  )
}

export default AiButton