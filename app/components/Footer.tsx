import Link from 'next/link'
import React from 'react'
import SocialMediaHolder from './SocialMediaHolder'


const Footer = () => {
  return (
    <footer className='flex justify-between p-2 gap-4 bg-black text-white mt-4 flex-wrap items-center'>
        <div className='mx-auto flex items-center font-bold text-2xl justify-center'>
            <h1>HumanTalking</h1>
        </div>
        <nav className='flex-1 flex justify-center'>
        <ul className='flex gap-4 items-center'>
            <li><Link href="#">Cricket</Link></li>
            <li><Link href="#">WWE</Link></li>
            <li><Link href="#">Tennis</Link></li>
            <li><Link href="#">Politics</Link></li>
            <li><Link href="#">Tech</Link></li>
            </ul>
        </nav>
        <div className='flex gap-2 items-center mx-auto'>
            <SocialMediaHolder text="F" className="bg-blue-700 text-white text-xl"/>
            <SocialMediaHolder text="X" className="bg-blue-400 text-white text-xl"/>
            <SocialMediaHolder text="I" className="bg-pink-700 text-white text-xl"/>
            <SocialMediaHolder text="Y" className="bg-red-700 text-white text-xl"/>
            <SocialMediaHolder text="N" className="bg-blue-400 text-white text-xl"/>
        </div>
    </footer>
  )
}

export default Footer