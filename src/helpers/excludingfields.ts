export default function excludeFields<T extends Record<string, any>, Key extends keyof T>(
  obj: T | T[],
  keys: Key[]
): T | Array<Omit<T, Key>> {
  if (Array.isArray(obj)) {
    return obj.map(item =>
      Object.fromEntries(
        Object.entries(item).filter(([key]) => !keys.includes(key as Key))
      ) as Omit<T, Key>
    ) as Array<Omit<T, Key>>;
  } else {
    return Object.fromEntries(
      Object.entries(obj).filter(([key]) => !keys.includes(key as Key))
    ) as T;
  }
}
