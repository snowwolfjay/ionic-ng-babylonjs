import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";

export const target$$ = new BehaviorSubject(null);

export const useTarget = () => {
  const [val, setVal] = useState(null);
  useEffect(() => {
    const sub = target$$.subscribe((v) => {
      setVal(v);
    });
    return () => sub.unsubscribe();
  }, []);
  return val as any;
};
