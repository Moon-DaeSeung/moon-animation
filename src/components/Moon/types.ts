import { Equation, MoveInfo } from '../../libs/NumericalAnalyzer'

export type MoonConfig = {
  initial: MoveInfo;
  equation: Equation;
};

export type MoveInfos<T> = {
  [key in keyof T]: MoveInfo
}

export type Controller = {
  start: () => void
  cancle: () => void
}