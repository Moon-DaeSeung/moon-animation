import { Equation, MoveInfo } from '../../libs/NumericalAnalyzer'

export type AnalyzerConfig = {
  initial: MoveInfo;
  equation: Equation;
};

export type MoonValue<T> = {
  [key in keyof T]: MoveInfo
}

export type Controller = {
  start: () => void
  cancle: () => void
}
