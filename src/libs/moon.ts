export type Equation = (moveInfo: MoveInfo) => number
export type MoveInfo = {
  displacement: number
  velocity: number
}

export class Moon {
  private equation: Equation
  public moveInfo: MoveInfo

  constructor (equation: Equation, initialInfo: MoveInfo) {
    this.equation = equation
    this.moveInfo = initialInfo
  }

  move (dt: number) {
    const { velocity, displacement } = this.moveInfo
    const acceleration = this.equation(this.moveInfo)
    // 수치해석학 보고 더 나은 근사법 찾을 예정
    this.moveInfo.velocity = velocity + acceleration * dt
    this.moveInfo.displacement = displacement + velocity * dt
    return { ...this.moveInfo }
  }
}
