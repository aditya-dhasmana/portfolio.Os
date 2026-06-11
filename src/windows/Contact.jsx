import { socials } from '#constants'
import WindowControls from '../features/desktop-shell/components/WindowControls'
import windowWrapper from '../features/desktop-shell/hoc/windowWrapper'
import React from 'react'

const Contact = () => {


  return ( 
    <>
    <div id="window-header">
      <WindowControls target="contact"/>
      <h2>Contact Me</h2>
    </div>

    <div className="p-5 space-y-5">
      <img src="/images/adrian.jpg" alt="aditya" className='w-20 rounded-full' />

      <h3>Let's Connect</h3>
      <p>Got an Idea? A bug to squash? or just wanna talk?</p>

      <ul>
        {socials.map(({id , bg , link , icon , text})=>(
          <li key={id} style={{backgroundColor:bg,}}>
            <a href={link} target='_blank' rel='nopener noreferrer' title={text} >
              <img src={icon} alt={text} className='size-5' />
              <p>{text}</p>
            </a>
          </li>
        ))}
      </ul>

    </div>

    </>
  )
}

const ContactWindow = windowWrapper(Contact,'contact')

export default ContactWindow
