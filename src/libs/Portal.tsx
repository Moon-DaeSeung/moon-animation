import React, { useEffect } from 'react'
import ReactDom from 'react-dom'

export type ProtalProps = {
  children: React.ReactNode
}
export const Portal = ({ children }: ProtalProps) => {
  let portal = document.getElementById('portal')
  if (!portal) {
    portal = document.createElement('div')
    portal.setAttribute('id', 'portal')
    portal.style.position = 'absolute'
    portal.style.zIndex = '100'
    portal.style.width = '100%'
    document.body.append(portal)
  }

  return ReactDom.createPortal(children, portal)
}
