import { TabName } from "@/types";
import { createContext, useContext } from "react";

interface Context {
  currentTab: TabName;
  setCurrentTab: (tab: TabName) => void;
}

export const TabContext = createContext<null | Context>(null);

export function useTab() {
  const tabContext = useContext(TabContext);
  if (tabContext == null) throw new Error("Null context");
  return tabContext;
}
