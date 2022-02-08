export * from "./logger";
export * from "./stream";

export function looksEqual(v1: any, v2: any) {
  if (typeof v1 !== "object" || typeof v2 !== "object" || !v1 || !v2) {
    return v1 === v2;
  }
  const isArr1 = Array.isArray(v1);
  const isArr2 = Array.isArray(v2);
  if (isArr1 || isArr2) {
    if (!isArr2 || !isArr1) return false;
    else if (v1.length !== v2.length) return false;
    return v1.every((_, index) => looksEqual(_, v2[index]));
  }
  const keys1 = Object.keys(v1);
  const keys2 = Object.keys(v2);
  if (keys1.length !== keys2.length) return false;
  for (const key of keys1) {
    if (!looksEqual(v1[key], v2[key])) {
      return false;
    }
  }
  return true;
}
