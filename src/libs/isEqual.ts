function isNotSameLength (origin: any[] | any, other: any[] | any) {
  return Object.keys(origin).length !== Object.keys(other).length
}

export default function isEqual (origin: any[] | any | null, other: any[] | any | null): boolean {
  if (origin === other) return true
  if (origin === undefined && other === undefined) return true
  if (origin === null && other === null) return true
  if (origin === null || other === null) return false
  if (typeof origin !== typeof other) return false
  if (isNotSameLength(origin, other)) return false
  if (typeof origin === 'object') {
    let result = true;

    (Object.keys(origin) as (keyof object)[]).every((key) => {
      if (!isEqual(origin[key], other[key])) {
        result = false
        return false
      }

      return true
    })
    return result
  }
  return false
}
