export function transform <T, R> (object: T, cb: (value: T[keyof T]) => R): { [key in keyof T]: R; } {
  const result = {} as any
  for (const key in object) {
    result[key] = cb(object[key])
  }
  return result
}
