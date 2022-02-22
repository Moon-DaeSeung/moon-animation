export type Equation = (moveInfo: MoveInfo) => number
export type MoveInfo = {
  displacement: number
  velocity: number
}

export class NumericalAnalyzer {
  moveInfo: MoveInfo
  equation: Equation
  constructor (equation: Equation, moveInfo: MoveInfo) {
    this.equation = equation
    this.moveInfo = moveInfo
  }

  move (dt: number) {
    const { velocity, displacement } = this.moveInfo
    const acceleration = this.equation(this.moveInfo)
    // 수치해석학 보고 더 나은 근사법 찾을 예정
    this.moveInfo = {
      velocity: velocity + acceleration * dt,
      displacement: displacement + velocity * dt
    }
    return this.moveInfo
  }
}
