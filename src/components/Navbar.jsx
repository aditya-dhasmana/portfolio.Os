import dayjs from "dayjs"

import { navIcons, navLinks } from '#constants'

import React from 'react'
import useWindowStore from "#store/window"
import { OptimizedImage } from "#components/Index"

const Navbar = () => {
    const {openWindow} = useWindowStore();

  return (
    <nav role="banner" className="print:hidden relative z-[50] ">
        <div className="flex items-center gap-4">
            <OptimizedImage 
                src="/images/logo.svg" 
                alt="Aditya's Portfolio Logo" 
                className="h-8 w-8 sm:h-10 sm:w-10"
                priority
            />
            <p className='font-bold text-black text-sm sm:text-base lg:text-lg'>
                Aditya's portfolio
            </p>

            <ul 
                className="hidden sm:flex items-center gap-5" 
                role="menubar"
                aria-label="Main navigation"
            >
                {navLinks.map(({ id, name , type}) => (
                    <li key={id} role="none">
                        <button
                            onClick={() => openWindow(type)}
                            className="text-sm cursor-pointer hover:underline transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
                            role="menuitem"
                            aria-label={`Open ${name}`}
                        >
                            {name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
        
        <div className="flex items-center gap-3">
            <ul 
                className="hidden sm:flex items-center gap-3" 
                role="menubar"
                aria-label="System controls"
            >
                {navIcons.map(({id,img})=>(
                    <li key={id} role="none">
                        <button
                            className="p-1 hover:bg-gray-200 rounded hover:cursor-default focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-label={`System control ${id}`}
                        >
                            <OptimizedImage 
                            src={img} 
                            alt={`System icon ${id}`} 
                            className="w-4 h-4" 
                        />
                        </button>
                    </li>
                ))}
            </ul>
            <time 
                className="text-sm font-medium text-black" 
                dateTime={dayjs().format()}
                aria-label={`Current time: ${dayjs().format("dddd, MMMM D, YYYY [at] h:mm A")}`}
            >
                {dayjs().format("ddd MMM D h:mm A")}
            </time>
        </div>
    </nav>
  )
}

export default Navbar