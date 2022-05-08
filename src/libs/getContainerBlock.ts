export const getContainerBlock = (element: HTMLElement) => {
  let parent = element.parentElement
  while (parent !== null) {
    const { position } = window.getComputedStyle(parent)
    if (['fixed', 'absolute', 'relative', 'sticky'].includes(position)) return parent
    parent = parent.parentElement
  }

  return document.body
}
