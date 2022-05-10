import { useEffect, ReactNode } from 'react'

import ReactDOM from 'react-dom'
export type RootPortalProps = { children: ReactNode, parentPortal?: HTMLElement | null }

function Portal ({ children, parentPortal }: RootPortalProps) {
  if (typeof window !== 'undefined') {
    if (parentPortal) {
      return ReactDOM.createPortal(children, parentPortal)
    }
    let portal = document.getElementById('root-portal')
    if (!portal) {
      portal = document.createElement('div')
      portal.setAttribute('id', 'root-portal')
      portal.style.top = '0px'
      portal.style.left = '0px'
      portal.style.position = 'absolute'
      portal.style.zIndex = '100'
      document.body.append(portal)
    }

    useEffect(() => {
      if (portal && portal.childNodes.length < 1) {
        return portal.remove()
      }
    }, [children, portal])

    return ReactDOM.createPortal(children, portal)
  } else { return null }
}

export default Portal
