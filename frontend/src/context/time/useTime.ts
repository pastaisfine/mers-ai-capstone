import { createContext, useContext } from "react";

interface Context {
  currentTimeText: string;
}

export const TimeContext = createContext<null | Context>(null);

export function useTime() {
  const timeContext = useContext(TimeContext);
  if (timeContext == null) throw new Error("Null context");
  return timeContext;
}
