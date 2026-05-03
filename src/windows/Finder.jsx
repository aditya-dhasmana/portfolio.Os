import { WindowControls } from '#components/Index'
import windowWrapper from '#hoc/windowWrapper'
import { Search } from 'lucide-react'
import React from 'react'
import { locations } from '#constants'
import { useLocationStore, useWindowStore } from '#store'
import clsx from 'clsx'

const Finder = () => {
  const {openWindow} = useWindowStore();

  const { activeLocation, setActiveLocation } = useLocationStore()
   
  const openItem = (item) => {
    if(item.fileType === 'pdf') return openWindow("resume");

    if(item.kind === 'folder' ) return setActiveLocation(item);


    if (item.fileType === 'txt') return openWindow("txtfile", item);
    
    if (item.fileType === 'img') return openWindow("imgfile", item); 

    if (['fig' , 'url'].includes(item.fileType) && item.href) 
      return window.open(item.href, "_blank")
 
    
  }

  const renderList= (name,items) => 
    <div>
      <h3>{name}</h3>

      <ul>

          {items.map((item) => (
            <li key={item.id} onClick={() => setActiveLocation(item)}  className={clsx(item.id === activeLocation.id ? 'active' : 'not-active')} >
                  <img src={item.icon} className='w-4' alt={item.name} />
                  <p className="text-sm font-medium truncate">{item.name}</p>
            </li>
          )) }

      </ul>
      </div>

  return (
    <>
      <div id="window-header">
        <WindowControls target='finder' />
        <Search className='icon' />
      </div>

      <div className="bg-white flex h-full">
        <div className='sidebar'>
              {renderList('Favorites' , [locations.work, locations.about, locations.gallery, locations.resume])}
              {renderList('Projects' , locations.work.children)}
        </div>

      <div className='content-grid'>
        {activeLocation?.children.map((item) => (
          <div key={item.id} className='grid-item' onClick={() => openItem(item)}>
             <img src={item.icon} alt={item.name} className='item-icon' /> 
             <p className='item-name'>{item.name}</p>
          </div>
        ))}
      </div>
      </div>

    </>
  )
}

const FinderWindow = windowWrapper(Finder, "finder")
export default FinderWindow