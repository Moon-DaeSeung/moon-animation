
export const FrameLoop = (hook: (dt: number) => void) => {
  let now: number
  let animationId: number
  const loop = () => {
    const prev = now
    now = Date.now()
    const dt = (prev ? Math.min(64, now - prev) : 16.667) * 0.001
    hook(dt)
    animationId = window.requestAnimationFrame(loop)
  }

  return {
    start: loop,
    cancle: () => window.cancelAnimationFrame(animationId)
  }
}
