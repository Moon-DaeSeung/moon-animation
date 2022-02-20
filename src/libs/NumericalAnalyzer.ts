export type Equation = (moveInfo: MoveInfo) => number
export type MoveInfo = {
  displacement: number
  velocity: number
}

export const NumericalAnalyzer = (equation: Equation, initialInfo: MoveInfo) => {
  let moveInfo: MoveInfo = initialInfo

  const move = (dt: number) => {
    const { velocity, displacement } = moveInfo
    const acceleration = equation(moveInfo)
    // 수치해석학 보고 더 나은 근사법 찾을 예정
    moveInfo = {
      velocity: velocity + acceleration * dt,
      displacement: displacement + velocity * dt
    }
    return moveInfo
  }

  return move
}
